const express = require("express");
const customerRouter = express.Router();
const {userSignup,userLogin} = require("../controllers/customerControllers.js");
const {isAdmin} = require("../middlewares/admin.js");
const verify = require("../middlewares/verify.js");
const isLoggedin = require("../middlewares/isLoggedin.js");
customerRouter.route("/login").post(isLoggedin,isAdmin,userLogin);
customerRouter.route("/signup").post(userSignup);



module.exports = customerRouter;