import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post(
  "/register",
  authController.validateRegisterUser,
  authController.registerUser
);

router.post("/login", authController.validateLogin, authController.login);

router.post("/logout", authController.authorization, authController.logout);

export const authRouter = router;
