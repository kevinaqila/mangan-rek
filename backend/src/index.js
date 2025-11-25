import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import placeRoutes from "./routes/place.route.js";
import categoryRoutes from "./routes/category.route.js";
import ratingRoutes from "./routes/rating.route.js";
import roleRequestRoutes from "./routes/roleRequest.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

// Connect to MongoDB on startup (for both serverless and normal)
connectDB().catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Simple CORS for portfolio
app.use(cors({
  origin: ["http://localhost:5173", "https://mangan-rek.vercel.app"],
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/role-requests", roleRequestRoutes);

// Root route for health check
app.get("/", (req, res) => {
  res.json({
    message: "Mangan Rek API Server",
    status: "running",
    version: "1.0.0",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    status: err.status || 500,
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// For Vercel serverless
export default app;
