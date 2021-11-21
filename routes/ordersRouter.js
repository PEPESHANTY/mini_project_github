const express = require("express");
const ordersRouter = express.Router();
const verify = require("../middlewares/verify.js");
const {getAllOrders} = require("../controllers/ordersController.js");
ordersRouter.route("/").get(verify,getAllOrders);

module.exports = ordersRouter;