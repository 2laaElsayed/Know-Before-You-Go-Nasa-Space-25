const { body } = require("express-validator");
const ValidatorBase = require("./ValidatorBase");
const User = require("../../models/User");

class UserValidator extends ValidatorBase {
    static register() {
        return this.withValidation([
            body("username")
                .notEmpty().withMessage("Username is required")
                .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),

            body("email")
                .isEmail().withMessage("Must be a valid email")
                .notEmpty().withMessage("Email is required")
                .custom(async (value) => {
                    const existingUser = await User.findOne({ email: value });
                    if (existingUser) {
                        throw new Error("Email already exists");
                    }
                    return true;
                }),

            body("password")
                .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),

            
            body("role")
                .optional()
                .isIn(["organnizer", "user"])
                .withMessage("Role must be user or organizer")
        ]);
    }

    static login() {
        return this.withValidation([
            body("email")
                .isEmail().withMessage("Must be a valid email")
                .notEmpty().withMessage("Email is required"),

            body("password")
                .notEmpty().withMessage("Password is required")
        ]);
    }

    static forgetPassword() {
        return this.withValidation([
            body("email")
                .isEmail().withMessage("Must be a valid email")
                .notEmpty().withMessage("Email is required")
        ]);
    }

    static resetPassword() {
        return this.withValidation([
            body("email")
                .isEmail().withMessage("Must be a valid email")
                .notEmpty().withMessage("Email is required"),

            body("code")
                .notEmpty().withMessage("OTP is required")
                .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),

            body("newpassword")
                .isLength({ min: 8 }).withMessage("New password must be at least 8 characters long")
                .notEmpty().withMessage("New password is required")
        ]);
    }

    static verifyEmail() {
        return this.withValidation([
            body("code")
                .notEmpty().withMessage("OTP is required")
                .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),

            body("email")
                .isEmail().withMessage("Must be a valid email")
                .notEmpty().withMessage("Email is required")
        ]);
    }
}

module.exports = UserValidator;
