const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const Url = require("./models/url");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const config = require("config");

const app = express();

// Connect to database
connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: false }));

// Passport config
require("./config/passport")(passport);

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: config.get("mongoURI") }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

// Define Routes
app.use("/", require("./routes/index"));
app.use("/api/url", require("./routes/url"));
app.use("/auth", require("./routes/auth"));

const PORT = 5000;

app.listen(process.env.PORT || PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
