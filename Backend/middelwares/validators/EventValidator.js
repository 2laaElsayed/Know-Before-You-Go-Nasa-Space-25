const { body } = require("express-validator");
const ValidatorBase = require("./ValidatorBase");

class EventValidator extends ValidatorBase {

    static createEvent() {
        return this.withValidation([
            body("title")
                .notEmpty().withMessage("Event title is required")
                .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),

            body("date")
                .notEmpty().withMessage("Event date is required")
                .isISO8601().withMessage("Date must be a valid ISO8601 date"),

            body("location.lat")
                .notEmpty().withMessage("Latitude is required")
                .isFloat({ min: -90, max: 90 }).withMessage("Latitude must be between -90 and 90"),

            body("location.lon")
                .notEmpty().withMessage("Longitude is required")
                .isFloat({ min: -180, max: 180 }).withMessage("Longitude must be between -180 and 180"),

            body("recurrence")
                .optional()
                .isIn(["none", "daily", "weekly", "monthly"])
                .withMessage("Recurrence must be one of none, daily, weekly, monthly"),

            body("notes")
                .optional()
                .isString().withMessage("Notes must be a string"),
        ]);
    }

}

module.exports = EventValidator;
