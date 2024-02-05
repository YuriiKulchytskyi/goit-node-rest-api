import express from "express";
import validateBody from "../helpers/validateBody.js";
import isValidId from "../middlewares/isValidId.js";


import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema
} from "../model/contact.js";

import {
  getAll,
  getContact,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
} from "../controllers/contacts.js";



const contactsRouter = express.Router();

contactsRouter.get("/", getAll);

contactsRouter.get("/:id", isValidId, getContact);

contactsRouter.delete("/:id", isValidId, removeContact);

contactsRouter.post("/", validateBody(createContactSchema), addContact);

contactsRouter.put("/:id",  isValidId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", validateBody(updateFavoriteSchema), updateStatusContact)

export default contactsRouter;