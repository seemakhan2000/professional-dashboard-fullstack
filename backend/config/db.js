const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri || uri.includes("YOUR_MONGODB_CONNECTION_STRING")) {
      console.warn(
        "[db] MONGODB_URI is not configured. The API will still run, but database operations will fail until a valid connection string is provided in backend/.env"
      );
      return;
    }

    await mongoose.connect(uri);
    console.log("[db] MongoDB connected successfully");
  } catch (error) {
    console.error("[db] MongoDB connection error:", error.message);
    console.warn(
      "[db] The server will continue running without a database connection. Fix MONGODB_URI in backend/.env and restart."
    );
  }
};

module.exports = connectDB;
