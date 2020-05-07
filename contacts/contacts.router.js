import { Router } from "express";
import { contactsController } from "./contacts.controller";

const router = Router();

router.get("/", contactsController.getContacts);

router.get("/:contactId", contactsController.getContactById);

router.post(
  "/",
  contactsController.validateAddContact,
  contactsController.addContact
);

router.delete("/:contactId", contactsController.deleteContact);

router.patch(
  "/:contactId",
  contactsController.validateUpdateContact,
  contactsController.updateContact
);

export const contactsRouter = router;
