import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import  { User }  from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY;

const registration = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});

    if (user) {
        throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });
  
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  };

  const userlogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  console.log(req.body);
    if (!user) {
      throw HttpError(401, "Email or password invalid");
    }
  
    const passwordCompare = await bcrypt.compare(password, user.password);
  
    if (!passwordCompare) {
      throw HttpError(401, "Email or password invalid");
    }
  
    const payload = {
      id: user._id,
    };
  
    const token = jwt.sign(payload, secretKey, { expiresIn: "12h" });
    await User.findByIdAndUpdate(user._id, { token });
  
    res.json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  };
  
  const userCurrent = async (req, res) => {
    const { email, subscription } = req.user;
  
    res.json({
      email,
      subscription,
    });
  };
  
  const userlogout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
  
    res.status(204).json("");
  };


export const register = ctrlWrapper(registration);
export const login = ctrlWrapper(userlogin);
export const current = ctrlWrapper(userCurrent);
export const logout = ctrlWrapper(userlogout);