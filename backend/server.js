require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();


connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000"
  })
);
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Dashboard API is running"
  });
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


app.use((err, req, res, next) => {
  console.error("[server] Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`[server] Dashboard API running on http://localhost:${PORT}`);
});
