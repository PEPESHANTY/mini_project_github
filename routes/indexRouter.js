const express = require("express");
const indexRouter = express.Router();
const {isAdmin} = require("../middlewares/admin.js");
const verify = require("../middlewares/verify.js");

indexRouter.get("/",(req,res)=>{
    res.render("home");
})

indexRouter.get("/login",(req,res)=>{
    res.render("login");
})

indexRouter.get("/signup",(req,res)=>{
    res.render("signup");
})

indexRouter.get("/admin",verify,isAdmin,(req,res)=>{
    res.render("admin");
})

module.exports = indexRouter;