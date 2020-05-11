import Joi from "joi";
import { uuid } from "uuidv4";
import { NotFound, EmptyRequiredField } from "../helpers/error.constructors";
import { createControllerProxy } from "../helpers/controllerProxy";
import contacts from "../db/contacts.json";

class ContactsController {
  getContacts(req, res, next) {
    return res.status(200).json(contacts);
  }

  getContactById(req, res, next) {
    try {
      const contactId = parseInt(req.params.contactId);

      const foundContact = this.getContactFromArray(contactId);

      return res.status(200).json(foundContact);
    } catch (err) {
      next(err);
    }
  }

  addContact(req, res, next) {
    try {
      const id = uuid();

      const newContact = {
        id,
        ...req.body,
      };

      contacts.push(newContact);

      return res.status(201).json(newContact);
    } catch (err) {
      next(err);
    }
  }

  updateContact(req, res, next) {
    try {
      const contactId = parseInt(req.params.contactId);

      const foundContact = this.getContactFromArray(contactId);

      const foundContactIndex = this.getContactIndexFromArray(contactId);

      const updatedContact = {
        ...foundContact,
        ...req.body,
      };

      contacts[foundContactIndex] = updatedContact;

      return res.status(200).json(updatedContact);
    } catch (err) {
      next(err);
    }
  }

  deleteContact(req, res, next) {
    try {
      const contactId = parseInt(req.params.contactId);

      const foundContactIndex = this.getContactIndexFromArray(contactId);

      console.log(contactId, foundContactIndex);
      contacts.splice(foundContactIndex, 1);

      return res.status(200).json({ message: "contact deleted" });
    } catch (err) {
      next(err);
    }
  }

  validateUpdateContact(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      throw new EmptyRequiredField("missing fields");
    }

    const updateContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });

    const result = Joi.validate(req.body, updateContactRules);

    if (result.error) {
      return res.status(404).send(result.error);
    }

    next();
  }

  validateAddContact(req, res, next) {
    const addContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const result = Joi.validate(req.body, addContactRules);
    if (result.error) {
      throw new EmptyRequiredField("missing required name field");
    }

    next();
  }

  getContactFromArray(contactId) {
    const contactFound = contacts.find((contact) => contact.id === contactId);
    if (!contactFound) {
      throw new NotFound("Not found");
    }

    return contactFound;
  }

  getContactIndexFromArray(contactId) {
    const contactFound = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (contactFound === -1) {
      throw new NotFound("Not found");
    }

    return contactFound;
  }
}

export const contactsController = createControllerProxy(
  new ContactsController()
);
