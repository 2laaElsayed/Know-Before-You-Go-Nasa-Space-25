const { body } = require("express-validator");
const ValidatorBase = require("./ValidatorBase");
const provinceCoordinates = require("../../utils/provinceCoordinates");

class EventValidator extends ValidatorBase {

    static createEvent() {
        return this.withValidation([
            body("title")
                .notEmpty().withMessage("Event title is required")
                .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),

            body("date")
                .notEmpty().withMessage("Event date is required")
                .isISO8601().withMessage("Date must be a valid ISO8601 date"),

            body("province")
                .notEmpty().withMessage("Province is required if lat/lon not provided")
                .isIn(Object.keys(provinceCoordinates)).withMessage("Invalid province"),

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
