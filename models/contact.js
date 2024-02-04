import { Schema, model } from "mongoose";
import Joi from "joi";
import handleMongooseError from "../middlewares/handleMongooseError.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
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
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const createContactSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Missing required name field" }),
  email: Joi.string()
    .required()
    .messages({ "any.required": "Missing required email field" })
    .email(),
  phone: Joi.string()
    .required()
    .messages({ "any.required": "Missing required phone field" }),
  favorite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": "Missing required favorite field" }),
});

export const Contact = model("contact", contactSchema);
export const schemas = {
  createContactSchema,
  updateFavoriteSchema,
  updateContactSchema,
};