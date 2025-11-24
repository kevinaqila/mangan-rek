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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean),
    credentials: true,
  })
);

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
