import config from '../../core/config';
import { Request, Response } from 'express';
import { User, Otp } from './models';
import { sendEmailOtp, sendSmsOtp } from '../../core/otp';
import { comparePassword, generateRandomNumber, hashPassword } from '../../core/utils';


// TODO: otp on coolodown: dont send otp
// if (otp.onCooldown) {
//     return res.status(429).json({status: 'failed', error: `OTP limit exeeded. 
//         Please Wait ${msToTime(config.OTP_RETRIES_COOLDOWN - (otp.expireAt - Date.now()))} and try again.`});
// }


export async function generateOtp(req: Request, res: Response): Promise<any> {

    const otpType = req.body.otpType;


    if (otpType == 'signUp' || otpType == 'signIn' || otpType == 'passwordReset') {
        if (req.body.authType == 'emailAddress') {

            if (otpType == 'signUp') {
                try {
                    const user = await User.findOne({ emailAddress: req.body.emailAddress }).exec();
                    if (user) return res.status(400).json({ status: 'failed', error: 'User Already Exists' });
                } catch (err) {
                    return res.status(500).json({ status: 'failed', error: 'Unable to Generate OTP' })
                }
            }
            else if (otpType == 'signIn' || otpType == 'passwordReset') {
                try {
                    const user = await User.findOne({ emailAddress: req.body.emailAddress }).exec();
                    if (!user) return res.status(400).json({ status: 'failed', error: 'User Already Exists' });
                } catch (err) {
                    return res.status(500).json({ status: 'failed', error: 'Unable to Generate OTP' })
                }
            }

            Otp.findOne({ emailAddress: req.body.emailAddress, purpose: otpType }, function (err: any, otp: any) {
                if (err) return res.status(500).json({ status: 'failed', error: 'Unable to Generate OTP' })
                if (!otp) {
                    Otp.create({
                        emailAddress: req.body.emailAddress,
                        value: generateRandomNumber(config.OTP_LENGTH),
                        purpose: otpType
                    }, function (error: any, newOtp: any) {
                        if (error)
                            return res.status(500).json({ status: 'failed', error: 'Unable to Generate OTP' });
                        sendEmailOtp(newOtp.emailAddress, newOtp.value, otpType);
                        return res.json({ status: 'success', id: newOtp.id });
                    })
                } else {
                    if (!otp.isExpired) {
                        sendEmailOtp(otp.emailAddress, otp.value, otpType);
                        return res.json({ status: 'success', id: otp.id })
                    } else {
                        Otp.create({
                            emailAddress: req.body.emailAddress,
                            value: generateRandomNumber(config.OTP_LENGTH),
                            purpose: otpType,
                        }, function (error: any, newOtp: any) {
                            if (error)
                                return res.status(500).json({ status: 'failed', error: 'Unable to Generate OTP' });
                            sendEmailOtp(newOtp.emailAddress, newOtp.value, otpType);
                            otp.remove(); // remove expired otp
                            return res.json({ status: 'success', id: newOtp.id });
                        })
                    }
                }
            });
        } else if (req.body.authType == 'phoneNumber') {

            if (otpType == 'signUp') {
                try {
                    const user = await User.findOne({ phoneNumber: req.body.phoneNumber }).exec();
                    if (user) return res.status(400).json({ status: 'failed', error: 'User Already Exists' });
                } catch (err) {
                    return res.status(500).json({ status: 'failed', error: 'Unable to Generate OTP' })
                }
            }
            else if (otpType == 'signIn' || otpType == 'passwordReset') {
                try {
                    const user = await User.findOne({ phoneNumber: req.body.phoneNumber }).exec();
                    if (!user) return res.status(400).json({ status: 'failed', error: 'User Already Exists' });
                } catch (err) {
                    return res.status(500).json({ status: 'failed', error: 'Unable to Generate OTP' })
                }
            }

            Otp.findOne({ phoneNumber: req.body.phoneNumber, purpose: otpType }, function (err: any, otp: any) {
                if (err) return res.status(500).json({ status: 'failed', error: 'Unable to Generate OTP' })
                if (!otp) {
                    Otp.create({
                        phoneNumber: req.body.phoneNumber,
                        value: generateRandomNumber(config.OTP_LENGTH),
                        purpose: otpType
                    }, function (error: any, newOtp: any) {
                        if (error) return res.status(500).json({ status: 'failed', error: 'Unable to Generate OTP' })
                        sendSmsOtp(newOtp.phoneNumber, newOtp.value, otpType)
                        return res.json({ status: 'success', id: newOtp.id })
                    })
                } else {
                    if (!otp.isExpired) {
                        sendSmsOtp(otp.phoneNumber, otp.value, otpType);
                        return res.json({ status: 'success', id: otp.id })
                    } else {
                        Otp.create({
                            phoneNumber: req.body.phoneNumber,
                            value: generateRandomNumber(config.OTP_LENGTH),
                            purpose: otpType,
                        }, function (error: any, newOtp: any) {
                            if (error) return res.status(500).json({ status: 'failed', error: 'Unable to Generate OTP' })
                            sendSmsOtp(newOtp.phoneNumber, newOtp.value, otpType)
                            otp.remove(); // remove expired otp
                            return res.json({ status: 'success', id: newOtp.id })
                        })
                    }
                }
            });
        }
    }
}

export async function signUp(req: Request, res: Response): Promise<any> {

    // check otp
    let otp;
    const userParams: any = {};
    try {
        if (req.body.authType == 'emailAddress') {
            otp = await Otp.findOne({ id: req.body.otpId, emailAddress: req.body.emailAddress, purpose: 'SIGN_UP' }).exec()
            userParams.emailAddress = req.body.emailAddress; // assign emailAddress to user Params for user creation
        }
        else if (req.body.authType == 'phoneNumber') {
            otp = await Otp.findOne({ id: req.body.otpId, phoneNumber: req.body.phoneNumber, purpose: 'SIGN_UP' }).exec()
            userParams.phoneNumber = req.body.phoneNumber; // assign phoneNumber to user Params for user creation
        }
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ status: 'failed', error: 'Unable to Sign Up' });
    }
    if (!otp || otp.value != req.body.otpValue) 
        return res.status(401).json({ status: "failed", error: 'OTP verification failed' });

    // otp verified ----

    let oldUser;
    // check if user already exists
    try {
        if (req.body.authType == 'emailAddress') {
            oldUser = await User.findOne({ emailAddress: req.body.emailAddress }).exec();
        }
        else if (req.body.authType == 'phoneNumber') {
            oldUser = await User.findOne({ phoneNumber: req.body.phoneNumber }).exec();
        }
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ status: 'failed', error: 'Unable to Sign Up' });
    }
    // return error if user already exists
    if(oldUser)
        return res.status(401).json({ status: 'failed', error: 'User Already Exists'})

    // create user
    userParams.firstName = req.body.firstName;
    userParams.lastName = req.body.lastName;
    userParams.password = hashPassword(req.body.password);
    userParams.isActive = true;

    let user;
    try {
        user = await User.create(userParams);
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ status: 'failed', error: 'Unable to Sign Up' });
    }
    if(user) {
        return res.json({
            status: 'success',
            user: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddress: user.emailAddress,
                phoneNumber: user.phoneNumber,
            }
        })
    }

    return res.status(500).json({ status: 'failed', error: 'Unable to Sign Up' });
}

export async function signIn(req: Request, res: Response): Promise<any> {
    if (req.body.authVia == 'password') {
        let user;
        try {
            if (req.body.authType == 'emailAddress'){
                user = await User.findOne({emailAddress: req.body.emailAddress}).exec(); 
            } else if (req.body.authType == 'phoneNumber') {
                user = await User.findOne({ phoneNumber: req.body.phoneNumber }).exec();
            } else if (req.body.authType == 'username') {
                user = await User.findOne({ username: req.body.username }).exec();
            }
        } catch (err: any) {
            console.log(err);
            return res.status(500).json({status: 'failed', error: 'Unable to Sign In'});
        }
        if(!user)
            return res.status(401).json({status: 'failed', error: 'Invalid Credentials'});
        else {
            if(!comparePassword(req.body.password, user.password)) {
                return res.status(401).json({status: 'failed', error: 'Invalid Credentials'});
            } else {
                // login user
                req.session.isAuthenticated = true;
                req.session.user = user;
                
                return res.json({status: true, user: {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddress,
                    phoneNumber: user.phoneNumber,
                }})
            }
        }
        
    }
}

export function signOut(req: Request, res: Response): any {
    req.session.isAuthenticated = false;
    return res.json({status: 'success'})
}

export function passwordReset(req: Request, res: Response): any {
    res.send('Password Reset');
}

export function checkUserStatus(req: Request, res: Response): any {
    return res.json({status: req.session.isAuthenticated})
}