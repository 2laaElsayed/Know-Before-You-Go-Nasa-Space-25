const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  user: { 
    type: String,
    required: true,
  },
  event: {
    type: String, 
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
