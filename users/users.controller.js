import jwt from "jsonwebtoken";
import { userModel } from "./users.model";
import { createControllerProxy } from "../helpers/controllerProxy";
import {
  UnauthorizedError,
  SubscriptionValueError,
} from "../helpers/error.constructors";

class UsersController {
  async getCurrentUser(req, res, next) {
    try {
      const { email, subscription } = req.user;
      return res.status(200).json({
        email: email,
        subscription: subscription,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { subscription } = req.body;
      const { _id } = req.user;

      if (
        subscription !== "free" &&
        subscription !== "pro" &&
        subscription !== "premium"
      ) {
        throw new SubscriptionValueError("Impossible subscription value");
      }

      await userModel.updateUserById(_id, { subscription: subscription });

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getUserByToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");

      let userId;

      try {
        userId = jwt.verify(token, process.env.JWT_SECRET).userId;
      } catch (error) {
        throw new UnauthorizedError("Not authorized");
      }

      console.log("userId", userId);
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
}

export const usersController = createControllerProxy(new UsersController());
