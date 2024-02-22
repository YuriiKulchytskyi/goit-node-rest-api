import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import  { User }  from "../model/users.js";
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
  
    const token = jwt.sign(payload, secretKey, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user.id, { token });
  
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
    const owner = req.user.id;
    await User.findByIdAndUpdate(owner, { token: "" });
    res.status(204).json();
  };

  const changeSub = async (req, res) => {
    const owner = req.user.id;
    const { subscription } = req.body;
    await User.findByIdAndUpdate(owner, {subscription});
  
    res.status(202).json({
      message: "Subscription updated"
    });
  };


export const register = ctrlWrapper(registration);
export const login = ctrlWrapper(userlogin);
export const current = ctrlWrapper(userCurrent);
export const logout = ctrlWrapper(userlogout);
export const changeSubscription = ctrlWrapper(changeSub);