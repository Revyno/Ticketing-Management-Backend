"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const locationSchema = new Schema({
    name: { type: String, required: true },
    region: { type: Number },
    coordinates: { type: [Number], default: [0, 0] },
    isOnline: { type: Boolean, default: false },
}, { timestamps: true });
exports.Location = mongoose_1.default.model("Location", locationSchema);
