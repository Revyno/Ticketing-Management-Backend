import express from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import router from "./routes/api";
import { swaggerSpec } from "./utils/swagger";

// app tanpa listen / tanpa connect — dipakai lokal (index.ts) & serverless (api/index.ts)
const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", docs: "/api/docs" });
});

app.use("/api", router);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
