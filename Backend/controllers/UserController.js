const Event = require("../models/event");
const Favorite = require("../models/favorite");
const User = require("../models/Users");
const JSend = require("../utils/Jsend");
const Constants = require("../utils/constant");
const axios = require("axios");

const ML_BASE_URL = process.env.ML_URL || "https://tahany.pythonanywhere.com";
const provinceCoordinates = require("../utils/provinceCoordinates");


const getThreeDayForecastForUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        JSend.fail({ message: "User not found" })
      );
    }

    let lat = user.lat;
    let lon = user.lon;

    if (lat == null || lon == null) {
      const coords = provinceCoordinates[user.province];
      if (!coords) {
        return res.status(Constants.STATUSCODE.BAD_REQUEST).json(
          JSend.fail({ message: "Province coordinates not found" })
        );
      }
      lat = coords.lat;
      lon = coords.lon;
    }

    const mlResp = await axios.post(`${ML_BASE_URL}/predict_next_days`, {
      latitude: lat,
      longitude: lon,
      days: 3
    });

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      JSend.success({
        userId: user._id,
        username: user.username,
        forecastNext3Days_mm: mlResp.data.predictedRain_mm
      })
    );
  } catch (err) {
    next(err);
  }
};
const showProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        JSend.fail({ message: "User not found" })
      );
    }

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      JSend.success({ user })
    );
  } catch (err) {
    next(err);
  }
};

const editProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    delete updates.password;
    delete updates.email;
    delete updates.role;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
      select: "-password"
    });

    if (!updatedUser) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        JSend.fail({ message: "User not found" })
      );
    }

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      JSend.success({
        message: "Profile updated successfully",
        user: updatedUser
      })
    );
  } catch (err) {
    next(err);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        JSend.fail({ message: "User not found" })
      );
    }

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      JSend.success({ message: "Profile deleted successfully" })
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getThreeDayForecastForUser,
  showProfile,
  editProfile,
  deleteProfile,
};
