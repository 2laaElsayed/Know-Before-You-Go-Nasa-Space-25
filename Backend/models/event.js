const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const eventSchema = new mongoose.Schema(
  {
    eventId: { 
        type: String, 
        default: uuidv4, 
        unique: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    province: {
      type: String,
      trim: true,
    },
    date: { 
        type: Date, 
        required: true 
    },
    timezone: { 
        type: String, 
        default: "UTC" 
    },
    recurrence: { 
        type: String, 
        enum: ["none", "daily", "weekly", "monthly"], 
        default: "none" 
    },
    notes: { 
        type: String 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User", 
        required: true 
    },
    esiScore: { 
        type: Number, 
        default: null 
    }, 
    confidence: { type: String }, 
    recommendations: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
