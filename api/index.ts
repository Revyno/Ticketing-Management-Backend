// Vercel serverless entry — semua request masuk sini (lihat vercel.json rewrites).
// Pastikan DB connect (cached) sebelum app handle request.
import app from "../src/app";
import connectDB from "../src/utils/database";

let ready: Promise<unknown> | null = null;

export default async function handler(req: unknown, res: unknown) {
  ready = ready ?? connectDB();
  await ready;
  return (app as unknown as (req: unknown, res: unknown) => void)(req, res);
}
