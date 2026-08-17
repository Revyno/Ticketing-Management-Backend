import mongoose from "mongoose";

export interface Location {
  name: string;
  region?: number;
  coordinates?: number[]; // [lng, lat]
  isOnline?: boolean;
}

const Schema = mongoose.Schema;

const locationSchema = new Schema<Location>(
  {
    name: { type: String, required: true },
    region: { type: Number },
    coordinates: { type: [Number], default: [0, 0] },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Location = mongoose.model<Location>("Location", locationSchema);
