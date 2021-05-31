import { Router } from "express";

import * as controller from './controllers';
import * as validator from './validators';

const router = Router();

router.post('/signin',  validator.validateSignIn,  controller.signIn);
router.post('/signup',  validator.validateSignUp,  controller.signUp);
router.post('/signout', validator.validateSignOut, controller.signOut);

export { router as AccountRoutes };

