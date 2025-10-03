const JSend = require("../utils/Jsend");
const Constants = require("../utils/constant");
const { logError } = require("../utils/logger");

function errorHandler(err, req, res, next) {
    logError("Internal Server Error :", err);

    if (err.status === Constants.STATUSCODE.NOT_FOUND 
        || err.status === Constants.STATUSCODE.FORBIDDEN
        || err.status === Constants.STATUSCODE.BAD_REQUEST) {
        return res.status(err.status).json(
            JSend.fail(err.message)
        );
    }

    return res.status(err.status || Constants.STATUSCODE.SERVER_ERROR).json(
        JSend.error(
            err.message || "Internal Server Error",
            err.status || Constants.STATUSCODE.SERVER_ERROR,
            err.details || null
        )
    );
}


module.exports = errorHandler;
