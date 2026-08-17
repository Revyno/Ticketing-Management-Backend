import mongoose from "mongoose";

export interface Order {
  orderId: string;
  createdBy: mongoose.Types.ObjectId;
  events: mongoose.Types.ObjectId;
  ticket: mongoose.Types.ObjectId;
  quantity: number;
  total: number;
  status: string;
}

const Schema = mongoose.Schema;

const orderSchema = new Schema<Order>(
  {
    orderId: { type: String, unique: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    events: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    ticket: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// auto orderId
orderSchema.pre("validate", function (next) {
  if (!this.orderId) {
    this.orderId = "ORD-" + this._id.toString().toUpperCase();
  }
  next();
});

export const Order = mongoose.model<Order>("Order", orderSchema);
