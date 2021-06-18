import config from '../../core/config';
import { Request, Response } from 'express';
import { User, Otp } from './models';
import { sendEmailOtp, sendSmsOtp } from '../../core/otp';
import { generateRandomNumber } from '../../core/utils';


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

export function signUp(req: Request, res: Response): any {
    res.send("Sign UP");
}

export function signIn(req: Request, res: Response): any {
    res.send("Sign IN");
}

export function signOut(req: Request, res: Response): any {
    res.send("Sign OUT");
}

export function passwordReset(req: Request, res: Response): any {
    res.send('Password Reset');
}