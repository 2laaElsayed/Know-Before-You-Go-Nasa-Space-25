const express = require("express");
const router = express.Router();

const EventValidator = require("../middelwares/validators/EventValidator");
const EventController = require("../controllers/EventController");
const AuthMiddleware = require("../middelwares/AuthMiddleware"); 

router.post("/create",AuthMiddleware,EventValidator.createEvent(),EventController.createEvent);
router.put("/edit/:eventId", AuthMiddleware, EventValidator.createEvent(), EventController.editEvent); 
router.get("/:eventId/weather", AuthMiddleware, EventController.showWeatherForEvent);
router.get("/all",AuthMiddleware, EventController.getAllEvents);
router.post("/favorite/:eventId", AuthMiddleware, EventController.addFavorite);
router.get("/favorites", AuthMiddleware, EventController.getFavorites);
router.get("/download-csv", AuthMiddleware, EventController.downloadEventsCSV);
router.delete("/delete-event/:eventId", AuthMiddleware, EventController.deleteEvent);
module.exports = router;
