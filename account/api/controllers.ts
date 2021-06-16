import { Request, Response } from 'express';
import { User, Otp } from './models';

export function generateOtp (req: Request, res: Response ): any {
    console.log(req.body)
    res.send("Generate OTP")
}

export function signUp (req: Request, res: Response ): any {
    res.send("Sign UP")
}

export function signIn (req: Request, res: Response ): any {
    res.send("Sign IN")
}

export function signOut (req: Request, res: Response ): any {
    res.send("Sign OUT")
}
