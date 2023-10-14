const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const File = require("../models/File");

const convertToBase64 = require("../utils/convertToBase64");

router.post("/files/create", fileUpload(), async (req, res) => {
  try {
    const { name, upload, category, numberDownload, sizeFile, author } =
      req.body;

    const picture = req.files.picture;
    const finalPicture = await cloudinary.uploader.upload(
      convertToBase64(picture)
    );
    const newFile = new File({
      name: name,
      upload: upload,
      category: category,
      numberDownload: numberDownload,
      sizeFile: sizeFile,
      author: author,
      picture: finalPicture,
    });
    console.log(newFile);
    await newFile.save();
    res.json(newFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/files/list", async (req, res) => {
  try {
    const filesList = await File.find();
    res.json(filesList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/files/delete", async (req, res) => {
  try {
    await File.findByIdAndDelete(req.body.id);
    if (!req.body.id) {
      res.json({ message: "bad request" });
    } else {
      res.status(200).json({ message: "file deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/files/update", async (req, res) => {
  try {
    const updatedFile = await File.findByIdAndUpdate(req.body.id, {
      name: req.body.name,
    });
    if (req.body.name) {
      return res.json({ message: "file successfully updated" });
    }
    if (!req.body.name) {
      return res.json({ message: "request not found" });
    }
    await updatedFile.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
