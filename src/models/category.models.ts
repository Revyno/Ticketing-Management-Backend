import mongoose from "mongoose";

export interface Category {
  name: string;
  description?: string;
  icon?: string;
}

const Schema = mongoose.Schema;

const categorySchema = new Schema<Category>(
  {
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

export const Category = mongoose.model<Category>("Category", categorySchema);
