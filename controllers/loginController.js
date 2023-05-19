// JWT import
const jwt = require("jsonwebtoken");

// App constants
const devConstants = require("../env");


// DB Models
const Active_OTP = require("../models/activeOtp");
const Blocked_Account = require("../models/blockedAcount");
const Resend_OTP = require("../models/resendOtp");
const Used_OTP = require("../models/usedOtp");
const Wrong_Attempt = require("../models/wrongAttempts");


// Mail worker
const otpMailWorker = require("../kueWorkers/otpMailWorker");


// Function to create unique OTP
const otpGenerator = async () => {

    const digits = "9876543210";

    let otp = '';

    while(true){

        // Create 6 digit OTP by selecting random number every time.
        for(let i=0 ; i<6 ; i++){

            let randomNum = Math.floor(Math.random()*10);
            otp += digits.charAt(randomNum);

        }

        // check if otp has been used previously.
        const usedOtp = await Used_OTP.findOne({ otp });

        // if not used previously then return that otp.
        if(!usedOtp){
            return otp;
        }

    }

};


// Action to create and send otp.
module.exports.otpController = async (request, response) => {

    try {

        // if email is not provided then return
        if(!request.body.email){
            return response.status(400).json({
                success: false,
                msg: "Email required.."
            });
        }

        // check if account is blocked or not.
        const accountBlocked = await Blocked_Account.findOne({ user_email: request.body.email });

        // return if account is blocked.
        if(accountBlocked){
            return response.status(400).json({
                success: false,
                msg: "Account is blocked. Please try after 1 hr."
            });
        }

        // check for any otp sent in last 1 min.
        const otpSent = await Resend_OTP.findOne({ user_email: request.body.email });

        // if yes then return
        if(otpSent){
            return response.status(400).json({
                success: false,
                msg: "OTP already sent. Please try after 1 min."
            });
        }

        // create otp
        const otp = await otpGenerator();

        // check if any active otp exists
        let activeOTP = await Active_OTP.findOne({ user_email: request.body.email });

        // if exists then update the existing one.
        if(activeOTP){
            activeOTP.otp = otp;
            activeOTP.expiresAt = Date.now();
            await activeOTP.save();
        }
        // otherwise create new one.
        else{
            await Active_OTP.create({
                user_email: request.body.email,
                otp
            });
        }


        // store otp in recently sent which will be there for 1 min.
        await Resend_OTP.create({
            user_email: request.body.email
        });


        // send mail to user with otp.
        const job = otpMailWorker.create("otpMailSender", {
            user_email: request.body.email,
            otp
        }).save();


        // return successful msg.
        return response.status(200).json({
            success: true,
            msg: "OTP sent successfully to your email...!!"
        });
        
    } catch (error) {
        
        // if error occured then return error
        return response.status(500).json({
            success: false,
            msg: error
        });

    }

};



// action to control login.
module.exports.loginActionController = async (request, response) => {

    try {

        // return if either email or otp not provided.
        if(!request.body.email || !request.body.otp){
            return response.status(400).json({
                success: false,
                msg: "Email & OTP required."
            });
        }

        // check if account is blocked.
        const accountBlocked = await Blocked_Account.findOne({ user_email: request.body.email });

        // return if blocked.
        if(accountBlocked){
            return response.status(400).json({
                success: false,
                msg: "Account is blocked. Please try after 1 hr."
            });
        }

        // check for active otp for provided email id
        let activeOTP = await Active_OTP.findOne({ user_email: request.body.email });

        // if not exists then return with otp expired msg.
        if(!activeOTP){
            return response.status(400).json({
                success: false,
                msg: "Oops, OTP expired. Please retry by creating new OTP."
            });
        }


        // if otp exists but does not match with user provided otp.
        if(activeOTP.otp !== request.body.otp){
            // find previous wrong attempts.
            let wrongAttempts = await Wrong_Attempt.findOne({ user_email: request.body.email });

            let attempts_left = 0;

            // if wrong attempts are 4 i.e. 5 including current 1.
            // Block the account for 1 hr.
            if(wrongAttempts && wrongAttempts.attempts===4){
                
                // add account to block list.
                await Blocked_Account.create({
                    user_email: request.body.email
                });

                // make wrong attempts 0 again
                wrongAttempts.attempts = 0;
                await wrongAttempts.save();

            }
            // if wrong attempts are below 4
            else if(wrongAttempts){

                // increase wrong attempts count by 1.
                attempts_left = 5 - wrongAttempts.attempts -1;
                wrongAttempts.attempts = wrongAttempts.attempts + 1;
                await wrongAttempts.save();

            }
            // if user is making wrong attempt for 1st time login.
            else{
                attempts_left = 4;
                // add fresh record to block list
                await Wrong_Attempt.create({
                    user_email: request.body.email,
                    attempts: 1
                });
            }

            // return invalid otp msg with attempts left.
            return response.status(400).json({
                success: false,
                msg: attempts_left===0 ? 
                `5 Invalid attempts. Account locked. Please try after 1 Hr.` 
                : `Invalid OTP. ${attempts_left} attempts left.`
            });
            
        }


        // if otp is matching.
        // create payload.
        const payload = { user_email: request.body.email };

        // create jwt token.
        const token = jwt.sign(payload, devConstants.JWT_SECRET, { expiresIn: 5*60 });

        // add otp to used list.
        await Used_OTP.create({
            otp: request.body.otp
        });

        // set wrong attempt count to 0.
        let wrongAttempts = await Wrong_Attempt.findOne({ user_email: request.body.email });

        if(wrongAttempts){
            wrongAttempts.attempts = 0;
            await wrongAttempts.save();
        }
        else{
            await Wrong_Attempt.create({
                user_email: request.body.email,
                attempts: 0
            });
        }


        // delete that active otp.
        await Active_OTP.findByIdAndDelete(activeOTP.id);


        // return response with jwt token.
        return response.status(200).json({
            success: true,
            token,
            msg: "Log in successful..!!"
        });

        
    } catch (error) {

        return response.status(500).json({
            success: false,
            msg: error
        });
        
    }

};