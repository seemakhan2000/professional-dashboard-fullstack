const mongoose = require("mongoose");

const DashboardRecordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    value: {
      type: Number,
      required: true,
      default: 0
    },

    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("DashboardRecord", DashboardRecordSchema);
