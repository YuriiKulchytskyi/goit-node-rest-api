import express from 'express';
import {
    register,
    login,
    current,
    logout,
    changeSubscription
} from '../controllers/auth.js';

import { registerSchema, loginSchema, subscriptionShema } from '../model/users.js';
import validateBody from "../helpers/validateBody.js";
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.get("/current", authenticate, current);

router.post("/logout", authenticate, logout);

router.patch("/", validateBody(subscriptionShema), authenticate, changeSubscription);

export default router;