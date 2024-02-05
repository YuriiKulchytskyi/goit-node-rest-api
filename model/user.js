import { Schema, model } from "mongoose";
import Joi from "joi";
import {handleMongooseError} from "../helpers/handleMongooseError.js";

const userSchema = new Schema ({
        password: {
          type: String,
          required: [true, 'Set password for user'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        token: {
          type: String,
          default: null,
        },
      },
      { versionKey: false, timeseries: true });



const registerSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});


userSchema.post("save", handleMongooseError);
const User = model("user", userSchema);

export { User, registerSchema, loginSchema };