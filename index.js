const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const Url = require("./models/url");

const app = express();

// Connect to database
connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await Url.find();
  res.render("index", { shortUrls: shortUrls });
});

app.use(express.json({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

// Define Routes
app.use("/", require("./routes/index"));
app.use("/api/url", require("./routes/url"));

const PORT = 5000;

app.listen(process.env.PORT || PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
