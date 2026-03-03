import "dotenv/config";
import express from "express";
import cors from "cors";
import configsRoutes from "./routes/configs.routes.js";
import transactionsRoutes from "./routes/transactions.routes.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => res.json({ ok: true, service: "finance-backend" }));

app.use("/api/configs", configsRoutes);
app.use("/api/transactions", transactionsRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("API listening on", port));