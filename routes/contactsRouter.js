import express from "express";
import {
    getAll,
    getById,
    deleteById,
    create,
    updateById,
    updateFavorite,
} from "../controllers/contacts.js";
import {
    schemas
} from "../models/contact.js";
import validateBody from "../middlewares/validateBody.js";
import isValidId from "../middlewares/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAll);

contactsRouter.get("/:id", isValidId, getById);

contactsRouter.delete("/:id", isValidId, deleteById);

contactsRouter.post("/", validateBody(schemas.createContactSchema), create);

contactsRouter.put(
    "/:id",
    isValidId,
    validateBody(schemas.updateContactSchema),
    updateById
);

contactsRouter.patch(
    "/:id/favorite",
    isValidId,
    validateBody(schemas.updateFavoriteSchema),
    updateFavorite
);

export default contactsRouter;