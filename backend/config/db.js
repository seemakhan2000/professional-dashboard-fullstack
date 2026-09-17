const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("YOUR_MONGODB_CONNECTION_STRING")) {
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    isConnected = true;

    console.log("[db] MongoDB connected successfully");
  } catch (error) {
    isConnected = false;

    console.error("[db] MongoDB connection error:", error.message);

    throw error;
  }
};

module.exports = connectDB;