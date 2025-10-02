const jwt = require('jsonwebtoken');
const JSend = require("../utils/Jsend");
const Constants = require("../utils/constants");
const User = require("../models/User");
const BlacklistedToken = require('../models/BlackListToken');

module.exports = async function AuthMiddleware(req, res, next) {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(Constants.STATUSCODE.UNAUTHORIZED).json(
        JSend.fail({ message: "No token provided" })
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userId: decoded.id });

    const blacklistedToken = await BlacklistedToken.findOne({ token });

    if (!user || blacklistedToken) {
      return res.status(Constants.STATUSCODE.UNAUTHORIZED).json(
        JSend.fail({ message: "Invalid token" })
      );
    }

    req.user = user;
    next();

  } catch (err) {
    next(err);
  }
};
