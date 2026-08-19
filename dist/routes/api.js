"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
const crud_controller_1 = require("../controllers/crud.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const owner_middleware_1 = require("../middlewares/owner.middleware");
const category_models_1 = require("../models/category.models");
const location_models_1 = require("../models/location.models");
const events_models_1 = require("../models/events.models");
const ticket_models_1 = require("../models/ticket.models");
const banner_models_1 = require("../models/banner.models");
const router = express_1.default.Router();
// CRUD generik: GET publik, tulis wajib login (+ guard tambahan opsional)
function crud(ctrl, guards = [auth_middleware_1.authenticate]) {
    const r = (0, express_1.Router)();
    r.get("/", ctrl.findAll);
    r.get("/:id", ctrl.findOne);
    r.post("/", ...guards, ctrl.create);
    r.put("/:id", ...guards, ctrl.update);
    r.delete("/:id", ...guards, ctrl.remove);
    return r;
}
// auth
router.post("/auth/register", auth_controller_1.default.register);
router.post("/auth/login", auth_controller_1.default.login);
router.get("/auth/:id", auth_middleware_1.authenticate, auth_controller_1.default.me);
// master data → admin only
const adminOnly = [auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("admin")];
router.use("/categories", crud((0, crud_controller_1.createCrudController)(category_models_1.Category), adminOnly));
router.use("/locations", crud((0, crud_controller_1.createCrudController)(location_models_1.Location), adminOnly));
router.use("/banners", crud((0, crud_controller_1.createCrudController)(banner_models_1.Banner), adminOnly));
// events → siapa pun yang login, createdBy diisi otomatis dari token
const eventCtrl = (0, crud_controller_1.createCrudController)(events_models_1.Event, ["category", "location", "createdBy"]);
const eventRouter = (0, express_1.Router)();
eventRouter.get("/", eventCtrl.findAll);
eventRouter.get("/:id", eventCtrl.findOne);
eventRouter.post("/", auth_middleware_1.authenticate, owner_middleware_1.setOwner, eventCtrl.create);
eventRouter.put("/:id", auth_middleware_1.authenticate, eventCtrl.update);
eventRouter.delete("/:id", auth_middleware_1.authenticate, eventCtrl.remove);
router.use("/events", eventRouter);
// tickets → login
router.use("/tickets", crud((0, crud_controller_1.createCrudController)(ticket_models_1.Ticket, ["events"])));
// orders → create pakai logika stok, sisanya generik. Semua wajib login.
const orderRouter = (0, express_1.Router)();
orderRouter.get("/", auth_middleware_1.authenticate, order_controller_1.default.findAll);
orderRouter.get("/:id", auth_middleware_1.authenticate, order_controller_1.default.findOne);
orderRouter.post("/", auth_middleware_1.authenticate, order_controller_1.default.create);
orderRouter.put("/:id", auth_middleware_1.authenticate, order_controller_1.default.update);
orderRouter.delete("/:id", auth_middleware_1.authenticate, order_controller_1.default.remove);
router.use("/orders", orderRouter);
exports.default = router;
