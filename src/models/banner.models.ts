import mongoose from "mongoose";

export interface Banner {
  title: string;
  image: string;
  isShow?: boolean;
}

const Schema = mongoose.Schema;

const bannerSchema = new Schema<Banner>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    isShow: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Banner = mongoose.model<Banner>("Banner", bannerSchema);
