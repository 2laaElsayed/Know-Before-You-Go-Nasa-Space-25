const User = require("../models/Users");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JSend = require("../utils/Jsend");
const Constants = require("../utils/constant");
const BlacklistedToken = require("../models/BlackListToken");
const sendMail = require("../utils/mailer");
const Token = require("../models/tokens");
const crypto = require("crypto");


registerUser = async function (req, res, next) {
    try {
        let { username, email, password, role } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (!role) {
            role = "user";
        }

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role,
        });
        console.log("Before save:", user);
        await user.save();
        console.log("User saved successfully");

        // await user.save();

        const otp = crypto.randomInt(100000, 1000000).toString();
        const tokenObject = new Token({
            userId: user._id,
            token: otp,
        });
        await tokenObject.save();

        const html = `
      Email Verification Request
      <br/>
      Your OTP code is: ${otp}
      <br/>
      This code will expire in ${Constants.EXPIRE.OTP} minutes.
    `;

        await sendMail(user.email, "Verify your email", html);

        return res.status(Constants.STATUSCODE.CREATED).json(
            JSend.success({
                message: "Please check your email to verify your account.",
            })
        );
    } catch (error) {
        next(error);
    }
};


loginUser = async function (req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });


        if (!user || !user.isVerified) {
            return res.status(Constants.STATUSCODE.UNAUTHORIZED).json(
                JSend.fail({
                    credentials: "Invalid email or account not verified",
                })
            );
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(Constants.STATUSCODE.UNAUTHORIZED).json(
                JSend.fail({
                    credentials: "Invalid email or password",
                })
            );
        }

        const token = jwt.sign(
            { id: user.userId, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: Constants.EXPIRE.JWT }
        );

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            JSend.success({
                auth: {
                    userId: user.userId,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token,
                },
            })
        );
    } catch (err) {
        next(err);
    }
};


logoutUser = async function (req, res, next) {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res
                .status(Constants.STATUSCODE.UNAUTHORIZED)
                .json(JSend.fail({ message: "No token provided" }));
        }

        const decoded = jwt.decode(token);
        const expireDate = new Date(decoded.exp * 1000);

        const blacklistedToken = new BlacklistedToken({
            token,
            expireAt: expireDate,
        });

        await blacklistedToken.save();
        return res
            .status(Constants.STATUSCODE.SUCCESS)
            .json(JSend.success({ message: "User logged out successfully" }));
    } catch (error) {
        next(error);
    }
};


verifyEmail = async function (req, res, next) {
    try {
        const { code, email } = req.body;

        const user = await User.findOne({ email: email });
        const tokenRecord = await Token.findOne({
            userId: user._id,
            token: code,
        });

        if (!user || !tokenRecord) {
            return res
                .status(Constants.STATUSCODE.BAD_REQUEST)
                .json(JSend.fail({ message: "Invalid code" }));
        }
        await User.updateOne(
            { _id: user._id },
            {
                $set: { isVerified: true },
            }
        );

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            JSend.success({
                message: "Email verified successfully. You can now log in.",
            })
        );
    } catch (err) {
        next(err);
    }
};


forgetPassword = async function (req, res, next) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                JSend.fail({ message: "User with given email does not exist" })
            );
        }

        const otp = crypto.randomInt(100000, 1000000).toString();
        const tokenObject = new Token({
            userId: user._id,
            token: otp,
        });
        await tokenObject.save();

        const html = `
      Password Reset Request
      <br/>
      Your OTP code is: ${otp}
      <br/>
      This code will expire in ${Constants.EXPIRE.OTP} minutes.
    `;

        await sendMail(user.email, "Password Reset", html);

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            JSend.success({
                message: "Please check your email to reset your password.",
            })
        );
    } catch (err) {
        next(err);
    }
};


resetPassword = async function (req, res, next) {
    try {
        const { email, code, newpassword } = req.body;
        const user = await User.findOne({ email: email });
        const tokenRecord = await Token.findOne({
            userId: user._id,
            token: code,
        });
        if (!user || !tokenRecord) {
            return res
                .status(Constants.STATUSCODE.BAD_REQUEST)
                .json(JSend.fail({ message: "Invalid code or email" }));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newpassword, salt);

        user.password = hashedPassword;
        await user.save();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            JSend.success({
                message:
                    "Password reset successfully. You can now log in with your new password.",
            })
        );
    } catch (err) {
        next(err);
    }
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    verifyEmail,
    forgetPassword,
    resetPassword,
};
