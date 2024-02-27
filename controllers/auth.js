import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import {
  fileURLToPath
} from "url";
import {
  User
} from "../model/users.js";
import HttpError from "../helpers/HttpError.js";
import {
  ctrlWrapper
} from "../helpers/ctrlWrapper.js";
import nodemailer from 'nodemailer';
import {
  nanoid
} from 'nanoid';
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const __dirname = path.dirname(fileURLToPath(
  import.meta.url));
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const registration = async (req, res) => {
  const {
    email,
    password
  } = req.body;
  const user = await User.findOne({
    email
  });

  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyLink = `${req.protocol}://${req.get('host')}/users/verify/${verificationToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Please click the following link to verify your email: ${verifyLink}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const userlogin = async (req, res) => {
  const {
    email,
    password
  } = req.body;
  const user = await User.findOne({
    email
  });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, secretKey, {
    expiresIn: "23h"
  });
  await User.findByIdAndUpdate(user.id, {
    token
  });

  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const userCurrent = async (req, res) => {
  const {
    email,
    subscription
  } = req.user;

  res.json({
    email,
    subscription,
  });
};

const userlogout = async (req, res) => {
  const owner = req.user.id;
  await User.findByIdAndUpdate(owner, {
    token: ""
  });
  res.status(204).json();
};

const changeSub = async (req, res) => {
  const owner = req.user.id;
  const {
    subscription
  } = req.body;
  await User.findByIdAndUpdate(owner, {
    subscription
  });

  res.status(202).json({
    message: "Subscription updated"
  });
};

const updAvatar = async (req, res) => {
  const owner = req.user.id;

  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded"
    });
  }

  const {
    path: tempUpload,
    originalname
  } = req.file;
  const filename = `${owner}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  try {
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);

    Jimp.read(resultUpload, function (err, avatar) {
      if (err) throw err;
      avatar.resize(250, 250).write(resultUpload);
    });

    await User.findByIdAndUpdate(owner, {
      avatarURL
    });

    res.json({
      avatarURL
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({
      message: "Avatar upload failed"
    });
  }
};

const verificationEmail = async (req, res) => {
  try {
    const {
      verificationToken
    } = req.params;
    const user = await User.findOne({
      verificationToken
    });
    if (!user) {
      return res.status(404).json({
        error: 'Not Found'
      });
    }
    user.verificationToken = null;
    user.verify = true;
    await user.save();
    res.status(200).json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};

const resendEmail = async (req, res) => {
  const {
    email
  } = req.body;

  try {
    const user = await User.findOne({
      email
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    if (user.verified) {
      return res.status(400).json({
        message: "User is already verified"
      });
    }

    const verificationToken = nanoid();
    user.verificationToken = verificationToken;
    await user.save();

    const verifyLink = `${req.protocol}://${req.get(
      "host"
    )}/users/verify/${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Please click the following link to verify your email: ${verifyLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Verification email has been sent"
    });
  } catch (error) {
    console.error("Error resending verification email:", error);
    res
      .status(500)
      .json({
        message: "Failed to resend verification email"
      });
  }
};

export const register = ctrlWrapper(registration);
export const login = ctrlWrapper(userlogin);
export const current = ctrlWrapper(userCurrent);
export const logout = ctrlWrapper(userlogout);
export const changeSubscription = ctrlWrapper(changeSub);
export const updateAvatar = ctrlWrapper(updAvatar);
export const verifyEmail = ctrlWrapper(verificationEmail);
export const resendVerificationEmail = ctrlWrapper(resendEmail);