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
    console.log(req.user);

    // console.log(products);

    if(products.length!==0){
        res.render("products",{
            products,
            user_id:req.user.user_id,
        });
    }
    // else{
    //     res.render("products",{
    //         products:[],
    //         user_id:req.user.user_id,
    //     });
    // }

})

indexRouter.get("/cart",verify,async(req,res)=>{

    console.log(req.user);

    let mysql = `
        select * from orders 
        where user_id = "${req.user.user_id}";
    `
    const orders = await query(mysql);
    console.log("orders in cart : ",orders)


    let cartArray = [];
    let total_price = 0;

    

    for(let i=0;i<orders.length;i++){

        if(orders[i].order_status!=="paid"){
            let mysql = `
                select * from products 
                where product_id = "${orders[i].product_id}";
            `
            const products = await query(mysql);
            console.log("products in cart : ",products)
    
            let cartObj = {
                order_id:orders[i].order_id,
                product_id:products[0].product_id,
                product_name : products[0].product_name,
                product_description : products[0].product_description,
                product_quantity:orders[i].quantity,
                product_price:products[0].product_price,
                product_image:products[0].product_image
            }
            total_price = total_price + (cartObj.product_price * cartObj.product_quantity);
    
            console.log("total price is : ",total_price);
    
            cartArray.push(cartObj);
        }
    }

    console.log(cartArray);

    if(cartArray.length!==0){
        res.render("cart",{
            cartArray,
            total_price,
            user:{
                user_id:req.user.user_id,
                username:req.user.username,
                email:req.user.email
            }
        })
    }
    else{
        res.render("cart",{
            cartArray:[],
            user:{
                user_id:req.user.user_id,
                username:req.user.username,
                email:req.user.email
            }
        })
    }

})


module.exports = indexRouter;