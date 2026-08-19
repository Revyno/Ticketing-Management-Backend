// Promote user jadi admin.  Jalanin: npm run make-admin -- <email>
import mongoose from "mongoose";
import { MONGODB_URI } from "../utils/env";
import { User } from "../models/users.models";
 
 (async () => {
   const email = process.argv[2];
   if (!email) {
     console.error("Usage: npm run make-admin -- <email>");
     process.exit(1);
   }
   await mongoose.connect(MONGODB_URI, { dbName: "Ticketing-Management-Backend" });
   const user = await User.findOneAndUpdate(
     { email },
    { role: "admin" },
    { new: true }
  );
  console.log(user ? `OK: ${email} sekarang admin` : `User ${email} tidak ada`);
  await mongoose.disconnect();
  process.exit(0);
})();
