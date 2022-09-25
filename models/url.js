const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: { type: String, default: Date.now },
});

module.exports = mongoose.model("Url", urlSchema);
