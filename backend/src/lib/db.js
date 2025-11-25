import mongoose from "mongoose";

let dbConnection = null;

export const connectDB = async () => {
  if (dbConnection && mongoose.connection.readyState === 1) {
    return dbConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      connectTimeoutMS: 30000,
      family: 4, // Use IPv4
      waitQueueTimeoutMS: 30000,
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
