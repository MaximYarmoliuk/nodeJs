import express from "express";
import cors from "cors";
require("dotenv").config();
const morgan = require("morgan");
import { contactsRouter } from "./contacts/contacts.router";

export class ContactsServer {
  constructor() {
    this.server = null;
  }
  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.handleErrors();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: "http://localhost:3000" }));
    this.server.use(morgan("tiny"));
  }

  initRoutes() {
    this.server.use("/contacts", contactsRouter);
  }

  handleErrors() {
    this.server.use((err, req, res, next) => {
      delete err.stack;
      return res.status(err.status).send(`${err.name}: ${err.message}`);
    });
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server started listening on port", process.env.PORT);
    });
  }
}
