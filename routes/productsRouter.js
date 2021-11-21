const express = require("express");
const productsRouter = express.Router();
const { getAllProducts ,createProduct } = require("../controllers/productsController.js");
const {isAdmin} = require("../middlewares/admin.js");
const verify = require("../middlewares/verify.js");
const multer = require("multer");



const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, "uploads" + "__" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/JPG" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/PNG" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/JPEG"
  ) {
    console.log("running!!!!");
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

productsRouter.route("/").get(getAllProducts).post(verify,isAdmin,upload.single("product_image"),createProduct)

module.exports = productsRouter;
