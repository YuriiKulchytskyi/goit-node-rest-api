const fs = require("fs/promises")
const path = require('path');
const {nanoid} = require('nanoid');


const contactsPath = path.join(__dirname, '../', 'db', 'contacts.json');
console.log(contactsPath)

const listContacts = async() => {
    const readcontacts = await fs.readFile(contactsPath);
    return JSON.parse(readcontacts)
  }

  const getContactById = async (contactId) => {
    const allContacts = await listContacts();
    return allContacts.find(contact => contact.id === contactId) || null;
  }

  const removeContact = async (contactId)=> {
    const allContacts = await listContacts();

    const index = allContacts.findIndex(contact => contact.id === contactId);
    if (index === -1){
        return null;
    }

    const [removeOldContact] = allContacts.splice(index, 1);

    fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return removeOldContact;
  };
  
  const addContact = async(data) => {
    const allContacts = await listContacts();

    const newContact = {
        id: nanoid(),
        ... data
    }
     
    allContacts.push(newContact);

     fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
     return newContact;
  }

  const updateContact = async(contactId, data)=>{
    const allContacts = await listContacts();
    const index = allContacts.findIndex(contact => contact.id === contactId);
    if (index === -1){
        return null;
    }
    allContacts[index] = {id, ...data}
    fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return allContacts[index];
  }

  module.exports = {listContacts, getContactById, removeContact, addContact, updateContact}