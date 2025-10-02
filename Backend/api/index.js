require('dotenv').config({ override: true }); 
const app = require("../app");
const connectDB = require('../config/db');

connectDB()
.then(() => {
    console.log("MongoDB connected");
})
.catch(err => {
    console.error("MongoDB connection failed:", err);
});

module.exports = (req, res) => {
    return app(req, res);
};
