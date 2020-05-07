require = require("esm")(module);
const {ContactsServer} = require("./index");

new ContactsServer().start();
