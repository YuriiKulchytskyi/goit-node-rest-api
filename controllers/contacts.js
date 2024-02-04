import { Contact } from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

export const getAll = ctrlWrapper(async (_, res) => {
  const result = await Contact.find({}, "name email phone favorite");
  res.json(result);
});

export const getById = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);

  if (!result) {
    throw HttpError(404, "Not Found");
  }

  res.json(result);
});

export const deleteById = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);

  if (!result) {
    throw HttpError(404, "Not Found");
  }

  res.json({ message: "Deleted successfully" });
});

export const create = ctrlWrapper(async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
});

export const updateById = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});

export const updateFavorite = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});