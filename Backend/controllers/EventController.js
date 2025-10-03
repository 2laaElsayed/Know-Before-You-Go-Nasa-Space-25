const Event = require("../models/event");
const Favorite = require("../models/favorite");
const JSend = require("../utils/Jsend");
const Constants = require("../utils/constant");
const axios = require("axios");

const ML_BASE_URL = process.env.ML_URL || "https://tahany.pythonanywhere.com";

const createEvent = async (req, res, next) => {
  try {
    const { title, date, location, recurrence, notes } = req.body;

    if (!location || location.lat == null || location.lon == null) {
      return res.status(Constants.STATUSCODE.BAD_REQUEST).json(
        JSend.fail({ message: "Event latitude/longitude missing" })
      );
    }

    const event = new Event({
      title,
      date,
      location: {
        lat: location.lat,
        lon: location.lon,
        name: location.name || "",
      },
      recurrence: recurrence || "none",
      notes,
      createdBy: req.user.id,
    });

    await event.save();

    return res.status(Constants.STATUSCODE.CREATED).json(
      JSend.success({
        message: "Event created successfully",
        event,
      })
    );
  } catch (err) {
    next(err);
  }
};

const showWeatherForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({ eventId });

    if (!event) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        JSend.fail({ message: "Event not found" })
      );
    }

    const { location, date, title } = event;

    if (!location || location.lat == null || location.lon == null) {
      return res.status(Constants.STATUSCODE.BAD_REQUEST).json(
        JSend.fail({ message: "Event latitude/longitude missing" })
      );
    }

    const mlReqBody = {
      latitude: location.lat,
      longitude: location.lon,
    };

    if (date) mlReqBody.date = date.toISOString().slice(0, 10);

    const mlEndpoint = `${ML_BASE_URL}/predict_from_location`;
    const mlResp = await axios.post(mlEndpoint, mlReqBody);

    const {
      predictedRain_mm_day,
      temperature_used_C,
      wind_used_ms,
      esiScore,
      recommendation,
      comfortCondition,
    } = mlResp.data;

    // Save to DB
    event.esiScore = esiScore;
    event.recommendations = recommendation;
    await event.save();

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      JSend.success({
        eventId: event.eventId,
        title,
        date,
        latitude: location.lat,
        longitude: location.lon,
        rawData: {
          temperature: temperature_used_C,
          windSpeed: wind_used_ms,
          predictedRain_mm_day,
          esiScore,
          recommendation,
          comfortCondition,
        },
        interpreted: {
          rain:
            predictedRain_mm_day < 1
              ? "No significant rain"
              : predictedRain_mm_day < 5
              ? "Light rain"
              : predictedRain_mm_day < 20
              ? "Moderate rain"
              : "Heavy rain",
          temperature:
            temperature_used_C < 5
              ? "Very cold"
              : temperature_used_C < 15
              ? "Cold"
              : temperature_used_C < 25
              ? "Mild"
              : temperature_used_C < 35
              ? "Warm"
              : "Very hot",
          wind:
            wind_used_ms < 2
              ? "Calm"
              : wind_used_ms < 5
              ? "Light breeze"
              : wind_used_ms < 10
              ? "Moderate wind"
              : "Strong wind",
          esi: esiScore,
          comfortCondition,
          recommendation,
        },
      })
    );
  } catch (err) {
    next(err);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("createdBy", "username email");
    return res.status(Constants.STATUSCODE.SUCCESS).json(
      JSend.success({
        events,
      })
    );
  } catch (err) {
    next(err);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const { userId, eventId } = req.body;

    const event = await Event.findOne({ eventId });
    if (!event) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        JSend.fail({ message: "Event not found" })
      );
    }

    const existing = await Favorite.findOne({ user: userId, event: event.eventId });
    if (existing) {
      return res.status(Constants.STATUSCODE.BAD_REQUEST).json(
        JSend.fail({ message: "Event already in favorites" })
      );
    }

    const favorite = new Favorite({ user: userId, event: event.eventId });
    await favorite.save();

    return res.status(Constants.STATUSCODE.CREATED).json(
      JSend.success({ message: "Event added to favorites", favorite })
    );
  } catch (err) {
    next(err);
  }
};

const getFavorites = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const favs = await Favorite.find({ user: userId });

    const events = await Promise.all(
      favs.map(async (fav) => {
        const event = await Event.findOne({ eventId: fav.event });
        return { ...fav.toObject(), event };
      })
    );

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      JSend.success({ favorites: events })
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  addFavorite,
  getFavorites,
  showWeatherForEvent,
};
