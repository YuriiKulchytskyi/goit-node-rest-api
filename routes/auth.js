import express from 'express';
import {
    register,
    login,
    current,
    logout,
    changeSubscription,
    updateAvatar
} from '../controllers/auth.js';
import { upload } from '../middlewares/upload.js';
import { registerSchema, loginSchema, subscriptionShema } from '../model/users.js';
import validateBody from "../helpers/validateBody.js";
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.get("/current", authenticate, current);

router.post("/logout", authenticate, logout);

router.patch("/", validateBody(subscriptionShema), authenticate, changeSubscription);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

export default router;