import mongoose from "mongoose";

let dbConnection = null;

export const connectDB = async () => {
  if (dbConnection && mongoose.connection.readyState === 1) {
    return dbConnection;
  }

  try {
    const mongoUri = process.env.MONGODB_URL;

    if (!mongoUri) {
      console.error("❌ MONGODB_URL environment variable is not set!");
      console.log("⚠️  Please set MONGODB_URL in your .env file or Vercel dashboard");
      // Don't exit in production serverless
      if (process.env.NODE_ENV !== "production") {
        process.exit(1);
      }
      throw new Error("MONGODB_URL not set");
    }

    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      maxPoolSize: 3,
      minPoolSize: 1,
      retryWrites: true,
      connectTimeoutMS: 5000,
      family: 4,
    });

    dbConnection = conn;

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
      dbConnection = null;
    });

    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB error:", error.message);
      dbConnection = null;
    });

    console.log(`✅ MongoDB connected`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("Check that:");
    console.error("1. MONGODB_URL environment variable is set");
    console.error("2. Network connectivity to MongoDB Atlas");
    console.error("3. IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 for testing)");
    dbConnection = null;

    // Don't exit in production serverless
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    throw error;
  }
};
