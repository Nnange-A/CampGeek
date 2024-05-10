const User = require("../models/user");


module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
}


module.exports.register = async (req, res, next) => {

    const { username, email, password } = req.body.user;

    const user = new User({ username, email });

    try {

        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {

            if (err) return next(err);

            req.flash("success", "Welcome to CampGeek! Explore our various campgrounds.");

            res.redirect("/campgrounds");

        });

    } catch (error) {

        req.flash("error", error.message);

        res.redirect("/register");
        
    }

}


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}


module.exports.loginRedirect = (req, res) => {

    req.flash("success", `Welcome back, ${req.user.username}. Continue exploring our campgrounds.`);

    const redirectUrl = res.locals.returnTo || "/campgrounds";

    res.redirect(redirectUrl);

}


module.exports.logout = (req, res, next) => {

    const username = req.user.username;
    
    req.logout(function (err) {

        if (err) {
            return next(err);
        }

        req.flash("success", `Goodbye, ${username}. Come back soon.`);
        res.redirect("/");

    });
}