const mongoose = require("mongoose");
const Files = mongoose.model("Hosting", {
  name: String,
  upload: Boolean,
  category: String,
  numberDownload: Number,
  sizeFile: String,
  author: String,
  picture: Object,
});

module.exports = Files;
