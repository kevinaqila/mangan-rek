import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import placeRoutes from "./routes/place.route.js";
import categoryRoutes from "./routes/category.route.js";
import ratingRoutes from "./routes/rating.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/places", placeRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/ratings", ratingRoutes)

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
});