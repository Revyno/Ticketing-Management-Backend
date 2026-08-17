import mongoose from "mongoose";

import { DATABASE_URL } from "./env";

// cache koneksi di global → di serverless (Vercel) 1 koneksi dipakai ulang
// antar invocation, gak bikin koneksi baru tiap request.
declare global {
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

const connectDB = async () => {
  if (!global._mongoosePromise) {
    global._mongoosePromise = mongoose.connect(DATABASE_URL, {
      dbName: "Ticketing-Management-Backend",
      maxPoolSize: 10,
    });
  }
  return global._mongoosePromise;
};

export default connectDB;
