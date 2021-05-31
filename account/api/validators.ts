import express from 'express';
import { check, validationResult } from 'express-validator';

export const validateSignUp = [

    check('firstName').trim().notEmpty(),

    check('lastName').trim().notEmpty(),
    
    check('email').trim().notEmpty().withMessage('Email cannot be empty').bail()
        .normalizeEmail().isEmail().withMessage('Invalid Email Address').bail(),

    check('password').notEmpty().withMessage('Password cannot be empty').bail()
        .isLength({min: 8}).withMessage('Password too short.').bail()
        .isLength({max: 100}).withMessage('Password too long.'),

    (req: express.Request, res: express.Response, next: express.NextFunction): any => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()});
        next();
    }
]

export const validateSignIn = [
    
    check('email').trim().notEmpty().withMessage('Email cannot be empty').bail()
        .normalizeEmail().isEmail().withMessage('Invalid Email Address').bail(),

    check('password').notEmpty().withMessage('Password cannot be empty').bail()
        .isLength({min: 8}).withMessage('Password too short.').bail()
        .isLength({max: 100}).withMessage('Password too long.'),

    (req: express.Request, res: express.Response, next: express.NextFunction): any => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()});
        next();
    }
]

export const validateSignOut = [
    // Nothing to validate
]
