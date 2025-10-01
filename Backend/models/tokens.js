
const mongoose = require('mongoose');
const Constants = require('../utils/Constants');

const tokenSchema = new mongoose.Schema({
    token: { type: String, 
        required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: Constants.EXPIRE.OTP } // TTL index
    }
});


module.exports = mongoose.model('Token', tokenSchema);