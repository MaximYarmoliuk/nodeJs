import Joi from "joi";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import request from "request";
import { uuid } from "uuidv4";
import { userModel } from "../users/users.model";
import { createControllerProxy } from "../helpers/controllerProxy";
import {
  RegValidErr,
  RegConflictErr,
  UnauthorizedError,
  CreateAvatarError,
} from "../helpers/error.constructors";

class AuthController {
  constructor() {
    this._saltRounds = 8;
  }

  async registerUser(req, res, next) {
    try {
      const { email, password, subscription } = req.body;

      const existingUser = await userModel.findUserByEmail(email);

      if (existingUser) {
        throw new RegConflictErr("Email in use");
      }

      const passwordHash = await this.hashPassword(password);

      const avatarURL = this.avatarUpload();

      const createdUser = await userModel.createUser({
        email,
        passwordHash,
        avatarURL,
        subscription,
      });

      return res.status(201).json({
        user: this.composeUserForResponse(createdUser),
      });
    } catch (err) {
      next(err);
    }
  }

  avatarUpload() {
    try {
      const randomAvatarUrl = "https://loremflickr.com/320/240";
      const randomAvatarName = `${uuid()}.jpg`;

      request.get({ url: `${randomAvatarUrl}`, encoding: "binary" }, function (
        err,
        response,
        body
      ) {
        fs.writeFile(
          path.join(__dirname, `../public/images/${randomAvatarName}`),
          body,
          "binary",
          function (err) {
            if (err) {
              throw new CreateAvatarError("Error creating random avatar");
            }
          }
        );
      });

      const avatarURL = `http://localhost:3000/images/${randomAvatarName}`;

      return avatarURL;
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedError("User does not exist");
      }

      const isPasswordCorrect = await this.comparePasswordHash(
        password,
        user.passwordHash
      );

      if (!isPasswordCorrect) {
        throw new UnauthorizedError("Email or password is wrong");
      }

      const token = this.createToken(user._id);

      await userModel.updateUserById(user._id, { token });

      return res.status(200).json({
        user: this.composeUserForResponse(user),
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async authorization(req, res, next) {
    try {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");

      let userId;

      try {
        userId = jwt.verify(token, process.env.JWT_SECRET).userId;
      } catch (error) {
        throw new UnauthorizedError("Not authorized");
      }

      const user = await userModel.findUserById(userId);

      if (!user) {
        throw new UnauthorizedError("Not authorized");
      }

      req.user = user;
      req.token = token;

      next();
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      await userModel.updateUserById(req.user._id, { token: null });

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async validateRegisterUser(req, res, next) {
    try {
      const userRules = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      });

      const validateResult = Joi.validate(req.body, userRules);
      if (validateResult.error) {
        throw new RegValidErr(
          "Ошибка от Joi или другой валидационной библиотеки"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  async validateLogin(req, res, next) {
    try {
      const userRules = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      });

      const validateResult = Joi.validate(req.body, userRules);
      if (validateResult.error) {
        throw new RegValidErr(
          "Ошибка от Joi или другой валидационной библиотеки"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  async hashPassword(password) {
    return bcryptjs.hash(password, this._saltRounds);
  }

  async comparePasswordHash(password, passwordHash) {
    return bcryptjs.compare(password, passwordHash);
  }

  composeUserForResponse(user) {
    return {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    };
  }

  createToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET);
  }
}

export const authController = createControllerProxy(new AuthController());
