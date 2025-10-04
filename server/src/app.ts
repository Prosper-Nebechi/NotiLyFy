import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import cors from "cors";
import eventsRouter from "./routes/events";
import adminRouter from "./routes/admin";
import { requireAuth, maintenanceGuard } from "./middleware/auth";
import emailRouter from "./routes/emails";
import preferencesRoutes from "./routes/preferences";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventsRouter);
app.use("/admin", requireAuth, adminRouter);
app.use("/email", emailRouter);
app.use("/preferences", preferencesRoutes);

app.use("/protected", requireAuth, maintenanceGuard, (_req, res) => {
    res.json({ ok: true, message: "You reached a protected endpoint." });
})

export default app;