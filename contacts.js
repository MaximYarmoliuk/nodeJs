"use strict";

const fs = require("fs");
const path = require("path");

const contactsPath = path.resolve("./db/contacts.json");

function listContacts() {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;

    const contacts = JSON.parse(data);

    console.log(contacts);
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;

    const contacts = JSON.parse(data);

    const contact = contacts.find((contact) => contact.id === contactId);

    console.log(contact);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;

    const contacts = JSON.parse(data);

    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );

    fs.writeFile(
      contactsPath,
      JSON.stringify(filteredContacts, null, 2),
      (err) => {
        if (err) throw err;
        console.log(filteredContacts);
      }
    );
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    if (err) throw err;

    const contacts = JSON.parse(data);

    contacts.push({
      id: contacts.length + 1,
      name: name,
      email: email,
      phone: phone,
    });

    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), (err) => {
      if (err) throw err;
      console.log(contacts);
    });
  });
}

module.exports = { listContacts, getContactById, removeContact, addContact };
