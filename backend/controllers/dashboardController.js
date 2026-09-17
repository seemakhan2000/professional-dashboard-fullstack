const DashboardRecord = require("../models/DashboardRecord");

// GET /api/dashboard
exports.getRecords = async (req, res) => {
  try {
    const records = await DashboardRecord.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error("[getRecords] error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch records"
    });
  }
};

// GET /api/dashboard/:id
exports.getRecordById = async (req, res) => {
  try {
    const record = await DashboardRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    return res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error("[getRecordById] error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch record"
    });
  }
};

// POST /api/dashboard
exports.createRecord = async (req, res) => {
  try {
    const { name, category, value, status } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required"
      });
    }

    const record = await DashboardRecord.create({
      name,
      category,
      value,
      status
    });

    return res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error("[createRecord] error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create record"
    });
  }
};

// PUT /api/dashboard/:id
exports.updateRecord = async (req, res) => {
  try {
    const { name, category, value, status } = req.body;

    const record = await DashboardRecord.findByIdAndUpdate(
      req.params.id,
      { name, category, value, status },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    return res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error("[updateRecord] error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update record"
    });
  }
};

// DELETE /api/dashboard/:id
exports.deleteRecord = async (req, res) => {
  try {
    const record = await DashboardRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    return res.json({
      success: true,
      message: "Record deleted successfully"
    });
  } catch (error) {
    console.error("[deleteRecord] error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete record"
    });
  }
};
