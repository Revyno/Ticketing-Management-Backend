import express, { Router } from "express";
import authController from "../controllers/auth.controller";
import orderController from "../controllers/order.controller";
import { createCrudController } from "../controllers/crud.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { setOwner } from "../middlewares/owner.middleware";
import { Category } from "../models/category.models";
import { Location } from "../models/location.models";
import { Event } from "../models/events.models";
import { Ticket } from "../models/ticket.models";
import { Banner } from "../models/banner.models";

const router = express.Router();

type Ctrl = ReturnType<typeof createCrudController>;

// CRUD generik: GET publik, tulis wajib login (+ guard tambahan opsional)
function crud(ctrl: Ctrl, guards: express.RequestHandler[] = [authenticate]) {
  const r = Router();
  r.get("/", ctrl.findAll);
  r.get("/:id", ctrl.findOne);
  r.post("/", ...guards, ctrl.create);
  r.put("/:id", ...guards, ctrl.update);
  r.delete("/:id", ...guards, ctrl.remove);
  return r;
}

// auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/:id", authenticate, authController.me);

// master data → admin only
const adminOnly = [authenticate, authorize("admin")];
router.use("/categories", crud(createCrudController(Category), adminOnly));
router.use("/locations", crud(createCrudController(Location), adminOnly));
router.use("/banners", crud(createCrudController(Banner), adminOnly));

// events → siapa pun yang login, createdBy diisi otomatis dari token
const eventCtrl = createCrudController(Event, ["category", "location", "createdBy"]);
const eventRouter = Router();
eventRouter.get("/", eventCtrl.findAll);
eventRouter.get("/:id", eventCtrl.findOne);
eventRouter.post("/", authenticate, setOwner, eventCtrl.create);
eventRouter.put("/:id", authenticate, eventCtrl.update);
eventRouter.delete("/:id", authenticate, eventCtrl.remove);
router.use("/events", eventRouter);

// tickets → login
router.use("/tickets", crud(createCrudController(Ticket, ["events"])));

// orders → create pakai logika stok, sisanya generik. Semua wajib login.
const orderRouter = Router();
orderRouter.get("/", authenticate, orderController.findAll);
orderRouter.get("/:id", authenticate, orderController.findOne);
orderRouter.post("/", authenticate, orderController.create);
orderRouter.put("/:id", authenticate, orderController.update);
orderRouter.delete("/:id", authenticate, orderController.remove);
router.use("/orders", orderRouter);

export default router;
