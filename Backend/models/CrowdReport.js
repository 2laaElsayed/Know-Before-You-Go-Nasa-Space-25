const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const crowdReportSchema = new mongoose.Schema(
  {
    reportId: { 
        type: String, 
        default: uuidv4, 
        unique: true 
    },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { 
        type: String, 
        enum: ["rain", "clear"], 
        required: true },
    location: {
      lat: Number,
      lon: Number,
    },
    reportedAt: { 
        type: Date, 
        default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CrowdReport", crowdReportSchema);
