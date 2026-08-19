import dotenv from "dotenv";
dotenv.config();
export const MONGODB_URI: string = process.env.MONGODB_URI || "";
export const JWT_SECRET: string =
  process.env.JWT_SECRET || "dev-secret-change-me";
export const JWT_EXPIRES: string = process.env.JWT_EXPIRES || "7d";
