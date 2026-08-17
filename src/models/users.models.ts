import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface User {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode?: string;
}

interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

type UserModel = mongoose.Model<User, {}, UserMethods>;

const Schema = mongoose.Schema;

const userSchema = new Schema<User, UserModel, UserMethods>(
  {
    fullName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    profilePicture: { type: String, default: "user.jpg" },
    isActive: { type: Boolean, default: false },
    activationCode: { type: String },
  },
  { timestamps: true }
);

// hash password sebelum simpan (hanya kalau berubah)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// jangan bocorin password di response JSON
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete (ret as Record<string, unknown>).password;
    return ret;
  },
});

export const User = mongoose.model<User, UserModel>("User", userSchema);
