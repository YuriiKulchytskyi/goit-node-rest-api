const express = require ("express");
const ctrl = require ("../controllers/contactsControllers.js");
const validateBody = require ('../helpers/validateBody.js')
const schema = require ('../schemas/contactsSchemas.js')

const contactsRouter = express.Router();

contactsRouter.get("/", ctrl.getAllContacts);

contactsRouter.get("/:id", ctrl.getContactById);

contactsRouter.delete("/:id", ctrl.deleteContact);

contactsRouter.post("/", validateBody(schema.createContactSchema), ctrl.createContact);

contactsRouter.put("/:id", validateBody(schema.updateContactSchema), ctrl.updateContact);

module.exports = contactsRouter;