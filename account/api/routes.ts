import { Router } from "express";

import * as controller from './controllers';
import * as validator from './validators';

const router = Router();

// route for handling otp generation
router.post('/generateotp', validator.validateGenerateOtp, controller.generateOtp);

// auth routes
router.post('/signin',  validator.validateSignIn,  controller.signIn);
router.post('/signup',  validator.validateSignUp,  controller.signUp);
router.post('/signout', validator.validateSignOut, controller.signOut);

export { router as AccountRoutes };

