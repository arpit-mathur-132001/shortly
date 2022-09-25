const express = require("express");
const router = express.Router();
const validUrl = require("valid-url");
const shortid = require("shortid");
const config = require("config");
const { ensureAuth } = require("../middleware/auth");

const Url = require("../models/url");

// @route   POST /api/url/shorten
// @desc    Create short URL
router.post("/shorten", ensureAuth, async (req, res) => {
  const longUrl = req.body.fullUrl;
  const baseUrl = config.get("baseUrl");
  const user = req.user.id;

  // Check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json("Invalid base url");
  }

  // Create url code
  const urlCode = shortid.generate();

  // Check long url
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });
      if (url) {
        res.redirect("/");
      } else {
        const shortUrl = baseUrl + urlCode;

        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          user,
          date: new Date(),
        });

        await url.save();

        res.redirect("/dashboard");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("Server error");
    }
  } else {
    res.status(401).json("Invalid long url");
  }
});

module.exports = router;
