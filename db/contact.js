import { Schema, model } from "mongoose";
const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    match: /^\(\d{3}\) \d{3}-\d{4}$/,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

export const Contact = model("contact", contactSchema);