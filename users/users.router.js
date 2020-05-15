import { Router } from "express";
import { usersController } from "./users.controller";

const router = Router();

router.get(
  "/current",
  usersController.getUserByToken,
  usersController.getCurrentUser
);

router.patch("/", usersController.getUserByToken, usersController.updateUser);

export const usersRouter = router;
