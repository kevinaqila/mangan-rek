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
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      maxPoolSize: 5,
      minPoolSize: 1,
      retryWrites: true,
      connectTimeoutMS: 10000,
      family: 4,
      waitQueueTimeoutMS: 5000,
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
    process.exit(1);
  }
};
