const express = require("express");
const router = express.Router();

const EventValidator = require("../middelwares/validators/EventValidator");
const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middelwares/AuthMiddleware"); 



router.get("/predict-three-days", AuthMiddleware,UserController.getThreeDayForecastForUser);


module.exports = router;
