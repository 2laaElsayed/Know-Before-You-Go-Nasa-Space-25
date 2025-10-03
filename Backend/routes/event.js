const express = require("express");
const router = express.Router();

const EventValidator = require("../middelwares/validators/EventValidator");
const EventController = require("../controllers/EventController");
const AuthMiddleware = require("../middelwares/AuthMiddleware"); 

router.post("/create",AuthMiddleware,EventValidator.createEvent(),EventController.createEvent);
router.get("/:eventId/weather", AuthMiddleware, EventController.showWeatherForEvent);
router.get("/all", EventController.getAllEvents);
router.post("/favorite",AuthMiddleware,EventController.addFavorite);
router.get("/favorites/:userId", AuthMiddleware, EventController.getFavorites);

module.exports = router;
