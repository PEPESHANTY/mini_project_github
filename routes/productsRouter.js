const express = require("express");
const productsRouter = express.Router();
const { getAllProducts } = require("../controllers/productsController.js");
const {isAdmin} = require("../middlewares/admin.js");
const verify = require("../middlewares/verify.js");
const multer = require("multer");



const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, "uploads" + "__" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "jpg" ||
    file.mimetype === "JPG" ||
    file.mimetype === "png" ||
    file.mimetype === "PNG" ||
    file.mimetype === "jpeg" ||
    file.mimetype === "JPEG"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
  limits:{
      fileSize:1024 * 1024 * 100
  }
});

productsRouter.route("/").get(getAllProducts).post(verify,isAdmin,upload.single("image"))

module.exports = productsRouter;
