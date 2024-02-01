const Joi = require("joi");

const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    phone: Joi.string().pattern(/\d/).min(1).required()
})

const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2}),
    phone: Joi.string().pattern(/\d/).min(1)
})
    .min(1)
    .message("Body must have at least one field");

module.exports = { createContactSchema, updateContactSchema };