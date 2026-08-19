"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const api_1 = __importDefault(require("./routes/api"));
const swagger_1 = require("./utils/swagger");
// app tanpa listen / tanpa connect — dipakai lokal (index.ts) & serverless (api/index.ts)
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.get("/", (_req, res) => {
    res.json({ status: "ok", docs: "/api/docs" });
});
app.use("/api", api_1.default);
app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
exports.default = app;
