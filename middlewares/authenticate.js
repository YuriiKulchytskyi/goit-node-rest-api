import jwt from 'jsonwebtoken';
import { User } from '../model/users.js';
import HttpError from "../helpers/HttpError.js";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY;

export const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
      next(HttpError(401));
    }
    try {
      const { id } = jwt.verify(token, secretKey);
      const user = await User.findById(id);
      if (!user || !user.token || user.token !== token) {
        next(HttpError(401));
      }
      req.user = user;
      next();
    } catch (error) {
      next(HttpError(401));
    }
  };

  