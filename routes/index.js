const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Url = require("../models/url");

// @desc Login/Landing page
// @route GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("index");
});

// @desc Dashboard
// @route GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  const shortUrls = await Url.find({ user: req.user.id }).lean();
  res.render("dashboard", {
    shortUrls: shortUrls,
    name: req.user.firstName,
  });
});

// @route     GET /:code
// @desc      Redirect to long/original URL
router.get("/in/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("No URL found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;
