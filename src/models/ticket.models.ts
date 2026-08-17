import mongoose from "mongoose";

export interface Ticket {
  name: string;
  price: number;
  quantity: number;
  events: mongoose.Types.ObjectId;
  description?: string;
}

const Schema = mongoose.Schema;

const ticketSchema = new Schema<Ticket>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    events: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Ticket = mongoose.model<Ticket>("Ticket", ticketSchema);
