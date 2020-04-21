const contactsFunc = require('./contacts')

const argv = require('yargs').argv;

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
        contactsFunc.listContacts()
      break;

    case 'get':
        contactsFunc.getContactById(id)
      break;

    case 'add':
       contactsFunc.addContact(name, email, phone)
      break;

    case 'remove':
        contactsFunc.removeContact(id)
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);