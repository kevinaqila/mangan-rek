import mongoose from "mongoose";

let dbConnection = null;

export const connectDB = async () => {
  if (dbConnection && mongoose.connection.readyState === 1) {
    return dbConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
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
    
    // Handle connection events
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
      dbConnection = null;
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error.message);
      dbConnection = null;
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    dbConnection = null;
    process.exit(1);
  }
};
