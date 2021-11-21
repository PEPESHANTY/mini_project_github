const express = require("express");
const indexRouter = express.Router();


indexRouter.get("/",(req,res)=>{
    res.render("home");
})

indexRouter.get("/login",(req,res)=>{
    res.render("login");
})

indexRouter.get("/signup",(req,res)=>{
    res.render("signup");
})

module.exports = indexRouter;