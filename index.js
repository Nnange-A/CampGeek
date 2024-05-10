if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const engine = require("ejs-mate");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const path = require("path");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");

const User = require("./models/user")

const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

const ExpressError = require("./utils/ExpressError");


const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/campGeekDB"
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Database connected"));


const app = express();
const port = process.env.PORT || 3000;


app.engine("ejs", engine);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));


const secret = process.env.SECRET || "mysecret";

const sessionConfig = {
    name: "session",
    secret,
    store: MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 60 * 60,
        crypto: {
            secret,
        }
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, // TO ENSURE THAT THE COOKIE ONLY WORKS OVER HTTPS. GOOD FOR DEPLOYMENT, HARDLY FOR DEVELOPMENT.
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}


// SANITIZE MONGO QUERIES, AGAINST MONGO INJECTIONS. YOU CAN ALSO REPLACE THE UNWANTED CHARACTERS, AS WE SEE IN THE COMMENTED-OUT PIECE OF CODE.
// THIS SANITIZES THE CONTENT ALL THE METHODS ON THE REQUEST OBJECT INCLUDING req.query, req.body, req.params, AND SO ON.
app.use(mongoSanitize());

app.use(helmet({ contentSecurityPolicy: false, }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(session(sessionConfig)); // MAKE SURE THIS session() MIDDLEWARE IS USED BEFORE passport.session()
app.use(flash()); // CAUSES THE req OBJECT TO POSSESS A METHOD CALLED flash()

app.use(passport.initialize());
app.use(passport.session()); // MAKE SURE THIS passport.session() MIDDLEWARE IS USED AFTER THE session() MIDDLEWARE REQUIRED FROM express-session
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // TO STORE A USER IN THE SESSION
passport.deserializeUser(User.deserializeUser()); // TO GET A USER OUT OF THE SESSION


app.use((req, res, next) => {
    res.locals.returnTo = req.session.returnTo;
    // DURING LOGIN, passport AUTOMATICALLY ADDS HE LOGGED IN USER'S DETAILS INTO THE REQUEST OBJECT UNDER req.user
    res.locals.url = req.url;
    res.locals.currentUser = req.user;
    res.locals.successMessage = req.flash("success");
    res.locals.errorMessage = req.flash("error");
    next();
})



app.get("/", (req, res) => {
    res.render("home");
});


app.use("/", userRoutes);


app.use("/campgrounds", campgroundRoutes);


app.use("/campgrounds/:id/reviews", reviewRoutes);



app.all("*", (req, res) => {
    throw new ExpressError("Page Not Found", 404);
});



app.use((err, req, res, next) => {

    const { statusCode = 500 } = err;

    if (!err.message) err.message = "Something went wrong";

    res.status(statusCode).render("error", { err });

});



app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});