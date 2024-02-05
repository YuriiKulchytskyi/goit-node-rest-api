import { Schema, model } from "mongoose";
import Joi from "joi";
import {handleMongooseError} from "../helpers/handleMongooseError.js";

const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  email: Joi.string()
    .email()
    .required(),

  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
   "boolean.empty": "missing field favorite",
   "any.required": "missing field favorite",
  })
})

const contactShema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      favorite: {
        type: Boolean,
        default: false,
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
  });

  contactShema.post("save", handleMongooseError);

  const Contact = model("contacts", contactShema);

  export { createContactSchema, updateContactSchema, updateFavoriteSchema, Contact };

  