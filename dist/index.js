"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./utils/database"));
const PORT = 3000;
(0, database_1.default)()
    .then(() => {
    console.log("Database connected");
    app_1.default.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`API docs on http://localhost:${PORT}/api/docs`);
    });
})
    .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});
