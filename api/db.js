import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://gaziurrahman4311_db_user:A/e43117278@dbarzar.fmnyt79.mongodb.net/?appName=dBarzar";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(MONGODB_URI, {
      dbName: "portfolio",
    });
    console.log("\x1b[32m[DB]\x1b[0m MongoDB connected successfully");
  } catch (err) {
    console.error("\x1b[31m[DB ERROR]\x1b[0m MongoDB connection failed:", err.message);
  }
};

export { connectDB };
