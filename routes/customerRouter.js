const express = require("express");
const customerRouter = express.Router();
const {userSignup,userLogin} = require("../controllers/customerControllers.js");
customerRouter.route("/login").post(userLogin);
customerRouter.route("/signup").post(userSignup);



module.exports = customerRouter;