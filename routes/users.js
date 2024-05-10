const passport = require("passport");
const express = require("express");

const catchAsync = require("../utils/catchAsync");

const users = require("../controllers/users")

const { validateUserRegister, validateUserLogin } = require("../middleware");


const router = express.Router();



router.route("/register")
    .get(users.renderRegisterForm)
    .post(validateUserRegister, catchAsync(users.register));


router.route("/login")
    .get(users.renderLoginForm)
    .post(
        validateUserLogin,
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        users.loginRedirect
    );


router.post('/logout', users.logout);



module.exports = router;