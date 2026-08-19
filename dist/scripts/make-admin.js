"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Promote user jadi admin.  Jalanin: npm run make-admin -- <email>
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../utils/env");
const users_models_1 = require("../models/users.models");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const email = process.argv[2];
    if (!email) {
        console.error("Usage: npm run make-admin -- <email>");
        process.exit(1);
    }
    yield mongoose_1.default.connect(env_1.MONGODB_URI, { dbName: "Ticketing-Management-Backend" });
    const user = yield users_models_1.User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
    console.log(user ? `OK: ${email} sekarang admin` : `User ${email} tidak ada`);
    yield mongoose_1.default.disconnect();
    process.exit(0);
}))();
