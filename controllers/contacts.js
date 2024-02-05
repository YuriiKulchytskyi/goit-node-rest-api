import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

import { Contact } from "../model/contact.js";

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, null, {
    skip,
    limit,
  }).populate("owner");
  res.json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({
    message: "Delete success",
  });
};

const createContact = async (req, res) => {
  const result = await Contact.create({...req.body, owner});
  res.status(201).json(result);
};

const updateContactById = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (Object.keys(data).length === 0) {
     throw HttpError(400, "Body must have at least one field");
  }
  const result = await Contact.findByIdAndUpdate(id, data, {new: true});
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await Contact.findByIdAndUpdate(id, data, {new: true});
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

export const getAll = ctrlWrapper(listContacts);
export const getContact = ctrlWrapper(getContactById);
export const addContact = ctrlWrapper(createContact);
export const updateContact = ctrlWrapper(updateContactById);
export const removeContact = ctrlWrapper(deleteContact);
export const updateStatusContact = ctrlWrapper(updateFavorite);