import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { ObjectId } = mongoose.Types;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  subscription: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
});

contactSchema.statics.getContacts = getContacts;
contactSchema.statics.getContactById = getContactById;
contactSchema.statics.addContact = addContact;
contactSchema.statics.updateContact = updateContact;
contactSchema.statics.deleteContact = deleteContact;

contactSchema.plugin(mongoosePaginate);

async function addContact(contactParams) {
  return this.create(contactParams);
}

async function getContacts(sub, skip, limit) {
  if (!sub){
    return this.find().skip(skip).limit(limit);
  }
  return this.find({ subscription: sub }).skip(skip).limit(limit);
}

async function getContactById(contactId) {
  if (!ObjectId.isValid(contactId)) {
    return null;
  }
  return this.findById(contactId);
}

async function updateContact(contactId, contactParams) {
  if (!ObjectId.isValid(contactId)) {
    return null;
  }
  return this.findByIdAndUpdate(
    contactId,
    { $set: contactParams },
    { new: true }
  );
}

async function deleteContact(contactId) {
  if (!ObjectId.isValid(contactId)) {
    return null;
  }
  return this.findByIdAndDelete(contactId);
}

export const contactModel = mongoose.model("Contact", contactSchema);
