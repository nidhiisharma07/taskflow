import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express(); // ✅ MUST COME BEFORE app.use

// middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*"
  })
);
app.use(express.json());
app.use(morgan("dev"));

// health route
app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes); // ✅ moved here

// error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;