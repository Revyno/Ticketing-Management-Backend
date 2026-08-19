"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ticketSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    events: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    description: { type: String },
}, { timestamps: true });
exports.Ticket = mongoose_1.default.model("Ticket", ticketSchema);
