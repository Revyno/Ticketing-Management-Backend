import { Request, Response } from "express";
import * as yup from "yup";
import { User } from "../models/users.models";
import { signToken } from "../utils/jwt";

type TRegister = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const registerValidateSchema = yup.object({
  fullName: yup.string().required(),
  userName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), ""], "Passwords must be match"),
});

export default {
  register: async (req: Request, res: Response) => {
    const { fullName, userName, email, password, confirmPassword }: TRegister =
      req.body;
    try {
      await registerValidateSchema.validate(
        { fullName, userName, email, password, confirmPassword },
        { abortEarly: false }
      );

      const user = await User.create({ fullName, userName, email, password });

      res.status(201).json({ message: "Register success", data: user });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: "Register failed", error: err.message });
    }
  },

  // login pakai email ATAU userName
  login: async (req: Request, res: Response) => {
    const { identifier, password } = req.body as {
      identifier: string;
      password: string;
    };
    try {
      const user = await User.findOne({
        $or: [{ email: identifier }, { userName: identifier }],
      });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = signToken({ id: user._id.toString(), role: user.role });
      res.status(200).json({ message: "Login success", data: { user, token } });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Login failed", error: err.message });
    }
  },

  // profil user dari token
  me: async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "OK", data: user });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Failed", error: err.message });
    }
  },
};
