import express from "express";
import validateBody from "../helpers/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import {authenticate} from '../middlewares/authenticate.js'


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
} from "../controllers/contactsControllers.js";



const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAll);

contactsRouter.get("/:id", authenticate, isValidId, getContact);

contactsRouter.delete("/:id", authenticate, isValidId, removeContact);

contactsRouter.post("/", authenticate, validateBody(createContactSchema), addContact);

contactsRouter.put("/:id", authenticate,  isValidId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", authenticate, validateBody(updateFavoriteSchema), updateStatusContact)

export default contactsRouter;