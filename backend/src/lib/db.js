import mongoose from "mongoose";

let dbConnection = null;

export const connectDB = async () => {
  if (dbConnection) {
    return dbConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
    });

    dbConnection = conn;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    dbConnection = null;
    process.exit(1);
  }
};
