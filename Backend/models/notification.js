const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const notificationSchema = new mongoose.Schema(
  {
    notificationId: { type: String, default: uuidv4, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    message: { type: String, required: true },
    type: { type: String, enum: ["alert", "reminder", "info"], default: "info" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
