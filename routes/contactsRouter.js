const express = require('express')
const validateBody = require('../helpers/validateBody.js')
const contactController = require('../controllers/contactsControllers.js');
const {createContactSchema, updateContactSchema} = require('../schemas/contactsSchemas.js')

const contactsRouter = express.Router();

contactsRouter.get("/", contactController.getAllContacts);

contactsRouter.get("/:id", contactController.getOneContact);

contactsRouter.delete("/:id", contactController.deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), contactController.createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), contactController.updateContact);

module.exports = contactsRouter;