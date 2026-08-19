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
// Vercel serverless entry — semua request masuk sini (lihat vercel.json rewrites).
// Pastikan DB connect (cached) sebelum app handle request.
const app_1 = __importDefault(require("../src/app"));
const database_1 = __importDefault(require("../src/utils/database"));
let ready = null;
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        ready = ready !== null && ready !== void 0 ? ready : (0, database_1.default)();
        yield ready;
        return app_1.default(req, res);
    });
}
exports.default = handler;
