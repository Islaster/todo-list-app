const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  priority: { type: String, required: true, default: "low" },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Task", taskSchema);
