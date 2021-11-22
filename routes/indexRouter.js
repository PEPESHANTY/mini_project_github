const express = require("express");
const indexRouter = express.Router();
const {isAdmin} = require("../middlewares/admin.js");
const verify = require("../middlewares/verify.js");
const connection = require("../db/connection.js");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

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

indexRouter.get("/products",verify,async(req,res)=>{
    let mysql = `
        select * from products;
    `
    const products = await query(mysql);

    if(products.length!==0){
        res.render("products",{
            products
        });
    }
    else{
        res.render("products",{
            products:[]
        });
    }

})

indexRouter.get("/cart",verify,async(req,res)=>{
    let mysql = `
        select * from orders;
    `
    const orders = await query(mysql);
   
    if(orders.length!==0){
        res.render("cart",{
            orders
        })
    }
    else{
        res.render("cart",{
            orders:[]
        })
    }

})


module.exports = indexRouter;