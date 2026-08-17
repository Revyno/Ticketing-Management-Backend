import mongoose from "mongoose";

export interface Event {
  name: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  location: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  description?: string;
  startDate: Date;
  endDate: Date;
  isOnline?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  banner?: string;
}

const Schema = mongoose.Schema;

const eventSchema = new Schema<Event>(
  {
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
  },
  { timestamps: true }
);

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

export const Event = mongoose.model<Event>("Event", eventSchema);
