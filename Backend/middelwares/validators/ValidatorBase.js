const { validationResult, query } = require("express-validator");
const JSend = require("../../utils/Jsend");
const Constants = require("../../utils/constant");
const Helpers = require("../../utils/Helper");
const xss = require("xss");

class ValidatorBase {
    static withValidation(rules) {
        return [...rules, this.validate, this.sanitize];
    }

    static validate(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(Constants.STATUSCODE.BAD_REQUEST).json(
                JSend.fail(Helpers.formatValidationErrors(errors))
            );
        }
        next();
    }

    static sanitize(req, res, next) {
        // sanitize body
        for (const key in req.body) {
            if (typeof req.body[key] === "string") {
                if (key.toLowerCase() === "password") {
                    req.body[key] = req.body[key].trim();
                } else {
                    req.body[key] = xss(req.body[key].trim());
                }
            }
        }

        // sanitize query
        for (const key in req.query) {
            if (typeof req.query[key] === "string") {
                req.query[key] = xss(req.query[key].trim());
            }
        }

        // sanitize params
        for (const key in req.params) {
            if (typeof req.params[key] === "string") {
                req.params[key] = xss(req.params[key].trim());
            }
        }
        next();
    }

    static get() {
        return this.withValidation([
            query("page")
                .optional()
                .isInt({ min: 1 })
                .withMessage("Page must be a positive integer"),

            query("limit")
                .optional()
                .isInt({ min: 1, max: 100 })
                .withMessage("Limit must be between 1 and 100"),
        ]);
    }
}

module.exports = ValidatorBase;
