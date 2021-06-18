import { sendSms } from './sms';
import { sendEmail } from './email';
import config from './config';
import { msToTime } from './utils';


export function sendSmsOtp(phoneNumber: string, otp: string, purpose: string):any {
    const message = `${otp} is your OTP for ${purpose} at ${config.SITE_NAME}. 
                    This will expire in ${msToTime(config.OTP_EXPIRE)}. 
                    Never share this OTP to anyone.`
    sendSms(phoneNumber, message)
}

export function sendEmailOtp(emailAddress: string, otp: string, purpose: string): any {
    const message = `${otp} is your OTP for ${purpose} at ${config.SITE_NAME}. 
                    This will expire in ${msToTime(config.OTP_EXPIRE)}. 
                    Never share this OTP to anyone.`
    sendEmail(emailAddress, message)
}