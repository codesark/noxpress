import { sendSms } from './sms';
import { sendEmail } from './email';
import config from './config';

export function sendSmsOtp(phoneNumber: string, otp: string, expiry: string, purpose: string,):any {
    const message = `${otp} is your OTP for ${purpose}. This will expire in ${expiry}. Never share this OTP to anyone.`
    sendSms(phoneNumber, message)
}

export function sendEmailOtp(emailAddress: string, otp: string, expiry: string, purpose: string): any {
    const message = `${otp} is your OTP for ${purpose}. This will expire in ${expiry}. Never share this OTP to anyone.`
    sendEmail(config.EMAIL_HOST_USER, emailAddress, message)
}