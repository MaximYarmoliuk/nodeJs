const express = require("express");
import cors from "cors";
import path from "path";
import morgan from "morgan";
import mongoose from "mongoose";
import { contactsRouter } from "./contacts/contacts.router";
import { authRouter } from "./auth/auth.router";
import { usersRouter } from "./users/users.router";

export class ContactsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    await this.initDatabase();
    this.initRoutes();
    // this.handleErrors();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use("/static", express.static(path.join(__dirname, "static")));
    this.server.use(morgan("tiny"));
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGO_DB_URL);
      console.log("Database connection successful");
    } catch (err) {
      console.log("MongoDB connection error", err);
      process.exit(1);
    }
  }

  initRoutes() {
    this.server.use("/contacts", contactsRouter);
    this.server.use("/auth", authRouter);
    this.server.use("/users", usersRouter);
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
