import mongoose, { Schema } from "mongoose";
import { uuid } from "uuidv4";

const { ObjectId } = mongoose.Types;

const userSchema = new Schema({
  email: String,
  passwordHash: String,
  avatarURL: String,
  verificationToken: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
});

userSchema.statics.createUser = createUser;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.findUserById = findUserById;
userSchema.statics.findUserByToken = findUserByToken;
userSchema.statics.updateUserById = updateUserById;
userSchema.statics.findByVerificationToken = findByVerificationToken;
userSchema.statics.verifyUser = verifyUser;

async function createUser(userParams) {
  userParams.verificationToken = uuid();
  return this.create(userParams);
}

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function findUserById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return this.findById(id);
}

async function findByVerificationToken(verificationToken) {
  return this.findOne({ verificationToken });
}

async function verifyUser(verificationToken) {
  return this.updateOne(
    { verificationToken },
    { $set: { verificationToken: null } }
  );
}

async function findUserByToken(token) {
  return this.findOne({ token });
}

async function updateUserById(id, userParams) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return this.findByIdAndUpdate(id, { $set: userParams }, { new: true });
}

export const userModel = mongoose.model("User", userSchema);
