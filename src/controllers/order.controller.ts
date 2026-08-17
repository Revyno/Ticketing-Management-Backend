import { Request, Response } from "express";
import mongoose from "mongoose";
import { Order } from "../models/order.models";
import { Ticket } from "../models/ticket.models";
import { createCrudController } from "./crud.controller";

// list/get/update/delete pakai generik, create pakai logika khusus di bawah
const base = createCrudController(Order, ["createdBy", "events", "ticket"]);

export default {
  ...base,

  // POST /api/orders  body: { ticket, quantity }
  // createdBy dari token, events + total dihitung, stok tiket dikurangi (atomic via transaction)
  create: async (req: Request, res: Response) => {
    const { ticket: ticketId, quantity } = req.body as {
      ticket: string;
      quantity: number;
    };
    const qty = Number(quantity);

    if (!ticketId || !qty || qty < 1) {
      return res.status(400).json({ message: "ticket & quantity (>=1) wajib" });
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const ticket = await Ticket.findById(ticketId).session(session);
      if (!ticket) throw new Error("Ticket not found");
      if (ticket.quantity < qty) {
        throw new Error(`Stok tidak cukup (sisa ${ticket.quantity})`);
      }

      ticket.quantity -= qty;
      await ticket.save({ session });

      const [order] = await Order.create(
        [
          {
            createdBy: req.user!.id,
            events: ticket.events,
            ticket: ticket._id,
            quantity: qty,
            total: ticket.price * qty,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      res.status(201).json({ message: "Order created", data: order });
    } catch (error) {
      await session.abortTransaction();
      res.status(400).json({ message: "Order failed", error: (error as Error).message });
    } finally {
      session.endSession();
    }
  },
};
