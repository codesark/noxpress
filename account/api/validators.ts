import express from 'express';
import { check, validationResult } from 'express-validator';
import { isValidPhoneNumber } from 'libphonenumber-js'

function validatePhoneNumber(phone: string) {
    // const regex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    return isValidPhoneNumber(phone)
}

export const validateGenerateOtp = [

    check('otpType')
        .notEmpty().withMessage('Required: auth | passwordReset | other ').bail()
        .isIn(['auth', 'passwordReset', 'other']).withMessage('Invalid value: expected - auth | passwordReset | other'),

    check('authType')
        .if(check('otpType').isIn(['auth', 'passwordReset']))
        .notEmpty().withMessage("Required: emailAddress | phoneNumber").bail()
        .isIn(['emailAddress', 'phoneNumber']).withMessage("Invalid Value: expected - emailAddress | phoneNumber"),

    check('emailAddress').trim()
        .if(check('authType').equals('emailAddress'))
        .notEmpty().withMessage('Email Address is Required').bail()
        .normalizeEmail().isEmail().withMessage('Invalid Email Address'),

    check('phoneNumber').trim()
        .if(check('authType').equals('phoneNumber'))
        .notEmpty().withMessage('Phone Number is required.').bail()
        .custom(value => validatePhoneNumber(value)).withMessage('Invalid Phone Number'),

    check('purpose')
        .if(check('otpType').equals('other'))
        .notEmpty().withMessage('Purpose is Required'),

    (req: express.Request, res: express.Response, next: express.NextFunction): any => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    }
]

export const validateSignUp = [

    // simple validation for required fields

    check('firstName').trim().notEmpty().withMessage('First name is requiered.'),
    check('lastName').trim().notEmpty().withMessage('Last name is required.'),

    check('authType').trim().notEmpty().withMessage("Required: emailAddress | phoneNumber").bail()
        .isIn(['emailAddress', 'phoneNumber']).withMessage("Invalid Value: expected - emailAddress | phoneNumber"),

    check('authVia').trim().notEmpty().withMessage("Required: password | otp").bail()
        .isIn(['password', 'otp']).withMessage("Invalid Value: expected - password | otp"),

    // advanced validation for optional fields

    check('emailAddress').trim()
        .if(check('authType').equals('emailAddress'))
        .notEmpty().withMessage('Email Address is Required').bail()
        .normalizeEmail().isEmail().withMessage('Invalid Email Address'),

    check('phoneNumber').trim()
        .if(check('authType').equals('phoneNumber'))
        .notEmpty().withMessage('Phone Number is required.').bail()
        .custom(value => validatePhoneNumber(value)).withMessage('Invalid Phone Number'),

    check('password')
        .if(check('authVia').equals('password'))
        .notEmpty().withMessage('Password is Required').bail()
        .isLength({ min: 8 }).withMessage('Password too short.').bail()
        .isLength({ max: 100 }).withMessage('Password too long.'),

    check('otpId')
        .if(check('authVia').equals('otp'))
        .notEmpty().withMessage('OTP ID is required'),

    check('otpValue')
        .if(check('authVia').equals('otp'))
        .notEmpty().withMessage('OTP is required').bail()
        .isLength({ max: 10 }).withMessage('OTP too long.'),

    (req: express.Request, res: express.Response, next: express.NextFunction): any => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    }
]

export const validateSignIn = [

    check('authType').trim().notEmpty().withMessage("Required: emailAddress | phoneNumber").bail()
        .isIn(['emailAddress', 'phoneNumber']).withMessage("Invalid Value: expected - emailAddress | phoneNumber"),

    check('authVia').trim().notEmpty().withMessage("Required: password | otp").bail()
        .isIn(['password', 'otp']).withMessage("Invalid Value: expected - password | otp"),

    // advanced validation for optional fields

    check('emailAddress').trim()
        .if(check('authType').equals('emailAddress'))
        .notEmpty().withMessage('Email Address is Required').bail()
        .normalizeEmail().isEmail().withMessage('Invalid Email Address'),

    check('phoneNumber').trim()
        .if(check('authType').equals('phoneNumber'))
        .notEmpty().withMessage('Phone Number is required.').bail()
        .custom(value => validatePhoneNumber(value)).withMessage('Invalid Phone Number'),

    check('password')
        .if(check('authVia').equals('password'))
        .notEmpty().withMessage('Password is Required').bail()
        .isLength({ min: 8 }).withMessage('Password too short.').bail()
        .isLength({ max: 100 }).withMessage('Password too long.'),

    check('otpId')
        .if(check('authVia').equals('otp'))
        .notEmpty().withMessage('OTP ID is required'),

    check('otpValue')
        .if(check('authVia').equals('otp'))
        .notEmpty().withMessage('OTP is required').bail()
        .isLength({ max: 10 }).withMessage('OTP too long.'),

    (req: express.Request, res: express.Response, next: express.NextFunction): any => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    }
]

export const validateSignOut = [
    // Nothing to validate
]
