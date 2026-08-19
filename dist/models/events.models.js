"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const eventSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isOnline: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    banner: { type: String },
}, { timestamps: true });
// auto-slug dari name kalau kosong
eventSchema.pre("validate", function (next) {
    if (this.name && !this.slug) {
        this.slug =
            this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
                "-" +
                this._id.toString().slice(-6);
    }
    next();
});
exports.Event = mongoose_1.default.model("Event", eventSchema);
