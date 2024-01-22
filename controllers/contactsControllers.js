
const contactsService = require('../services/contactsServices.js');

const Schema = require('../schemas/contactsSchemas.js');
const ctrlWrapper = require('../helpers/ctrlWrapper.js');

const HttpError = require('../helpers/HttpError.js');


 const getAllContacts = async (req, res, next) => {
    
      const allContacts = await contactsService.listContacts();
    res.status(200).json(allContacts)  
   
};

 const getContactById = async (req, res) => {

    const {id} = req.params;
    const contactsById =  await contactsService.getContactById(id);
    if (!contactsById){
          throw HttpError(404)
    }
     res.status(200).json(contactsById);

};

 const deleteContact = async (req, res) => {
    
    const {id} = req.params;
    const delContact = await contactsService.removeContact(id);
    if (!delContact){
        throw HttpError(404)
    } 
    res.status(200).json(delContact);

};

 const createContact = async (req, res) => {

    const newContact = await contactsService.addContact (req.body);
    res.status(201).json(newContact);

};

const updateContact = async (req, res) => {

    const{id} =req.params;
    const { body } = req.body;
    if (body === undefined) {
        throw HttpError(400, 'Body must have at least one field');
      }

    const changeContact = await contactsService.updateContact(id, req.body);
    if (!changeContact){
          throw HttpError(404)
    }
    res.status(200).json(changeContact);

};

module.exports = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getContactById: ctrlWrapper(getContactById),
    deleteContact: ctrlWrapper(deleteContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact)
}