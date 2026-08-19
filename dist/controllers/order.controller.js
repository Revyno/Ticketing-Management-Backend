"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const order_models_1 = require("../models/order.models");
const ticket_models_1 = require("../models/ticket.models");
const crud_controller_1 = require("./crud.controller");
// list/get/update/delete pakai generik, create pakai logika khusus di bawah
const base = (0, crud_controller_1.createCrudController)(order_models_1.Order, ["createdBy", "events", "ticket"]);
exports.default = Object.assign(Object.assign({}, base), { 
    // POST /api/orders  body: { ticket, quantity }
    // createdBy dari token, events + total dihitung, stok tiket dikurangi (atomic via transaction)
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { ticket: ticketId, quantity } = req.body;
        const qty = Number(quantity);
        if (!ticketId || !qty || qty < 1) {
            return res.status(400).json({ message: "ticket & quantity (>=1) wajib" });
        }
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const ticket = yield ticket_models_1.Ticket.findById(ticketId).session(session);
            if (!ticket)
                throw new Error("Ticket not found");
            if (ticket.quantity < qty) {
                throw new Error(`Stok tidak cukup (sisa ${ticket.quantity})`);
            }
            ticket.quantity -= qty;
            yield ticket.save({ session });
            const [order] = yield order_models_1.Order.create([
                {
                    createdBy: req.user.id,
                    events: ticket.events,
                    ticket: ticket._id,
                    quantity: qty,
                    total: ticket.price * qty,
                },
            ], { session });
            yield session.commitTransaction();
            res.status(201).json({ message: "Order created", data: order });
        }
        catch (error) {
            yield session.abortTransaction();
            res.status(400).json({ message: "Order failed", error: error.message });
        }
        finally {
            session.endSession();
        }
    }) });
