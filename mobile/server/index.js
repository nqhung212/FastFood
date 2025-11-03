import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import momoRouter from "./momo.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/health", (req, res) => res.json({ ok: true, message: "Server OK" }));

app.use("/api/momo", momoRouter);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`🚀 MoMo Server running on port ${PORT}`));
