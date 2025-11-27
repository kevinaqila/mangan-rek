import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
  console.log("Testing MongoDB connection...");
  console.log("MONGODB_URL:", process.env.MONGODB_URL ? "SET" : "NOT SET");

  if (!process.env.MONGODB_URL) {
    console.error("ERROR: MONGODB_URL not found in .env");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    const start = Date.now();

    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      maxPoolSize: 5,
      minPoolSize: 1,
    });

    const duration = Date.now() - start;
    console.log(`✅ Connected successfully in ${duration}ms`);
    console.log(`📊 Database: ${mongoose.connection.db.getName()}`);

    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📦 Collections: ${collections.map((c) => c.name).join(", ")}`);

    await mongoose.disconnect();
    console.log("✅ Disconnected successfully");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  }
};

testConnection();
