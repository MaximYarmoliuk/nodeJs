import { Router } from "express";
import multer from "multer";
import path from "path";
import { uuid } from "uuidv4";
import { usersController } from "./users.controller";

const randomAvatarName = `${uuid()}.jpg`;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../tmp"));
  },
  filename: function (req, file, cb) {
    cb(null, randomAvatarName);
  },
});

const upload = multer({
  storage,
});

const router = Router();

router.get(
  "/current",
  usersController.getUserByToken,
  usersController.getCurrentUser
);

router.patch("/", usersController.getUserByToken, usersController.updateUser);

router.patch(
  "/avatars", 
  usersController.getUserByToken,
  upload.single("avatar"),
  usersController.updateUserAvatar
);

export const usersRouter = router;
