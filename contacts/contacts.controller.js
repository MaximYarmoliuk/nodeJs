import Joi from "joi";
import { contactModel } from "./contacts.model";
import { NotFound, EmptyRequiredField } from "../helpers/error.constructors";
import { createControllerProxy } from "../helpers/controllerProxy";

class ContactsController {
  async getContacts(req, res, next) {
    const contacts = await contactModel.getContacts();

    return res.status(200).json(contacts);
  }

  async getContactById(req, res, next) {
    try {
      const { contactId } = req.params;

      const foundContact = await this.getContact(contactId);

      return res.status(200).json(foundContact);
    } catch (err) {
      next(err);
    }
  }

  async addContact(req, res, next) {
    try {
      const newContact = await contactModel.addContact(req.body);

      return res.status(201).json(newContact);
    } catch (err) {
      next(err);
    }
  }

  async updateContact(req, res, next) {
    try {
      const { contactId } = req.params;

      await this.getContact(contactId);

      const updatedContact = await contactModel.updateContact(
        contactId,
        req.body
      );

      return res.status(200).json(updatedContact.value);
    } catch (err) {
      next(err);
    }
  }

  async deleteContact(req, res, next) {
    try {
      const { contactId } = req.params;

      await this.getContact(contactId);
      await contactModel.deleteContact(contactId);

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
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string()
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
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string().required()
    });

    const result = Joi.validate(req.body, addContactRules);
    if (result.error) {
      throw new EmptyRequiredField("missing required name field");
    }

    next();
  }

  async getContact(contactId) {
    const contactFound = await contactModel.getContactById(contactId);
    if (!contactFound) {
      throw new NotFound("Not found");
    }

    return contactFound;
  }

}

export const contactsController = createControllerProxy(
  new ContactsController()
);
