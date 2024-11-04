import express from "express";

// express config
const app = express();

//Routes
import authRoutes from "./routes/auth.routes.js";

app.use("/api/auth", authRoutes);

export { app };
