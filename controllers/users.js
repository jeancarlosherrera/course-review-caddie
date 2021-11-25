const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register")
};

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err);
        })
        req.flash("success", "Welcome to Course Review Caddie App!")
        res.redirect("/courses")
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
};

module.exports.renderLoginForm = async (req, res) => {
    res.render("users/login");
};

module.exports.login = async (req, res) => {
    req.flash("success", `Welcome back ${req.body.username}!`)
    const redirectUrl = req.session.returnTo || "/courses"
    delete req.session.returnTo
    res.redirect(redirectUrl)
};

module.exports.logout = (req, res) => {
    req.logout()
    req.flash("success", "Goobye, see you soon!")
    res.redirect("/courses")
};