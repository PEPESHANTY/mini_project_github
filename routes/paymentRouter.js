const express = require('express');
const verify = require("../middlewares/verify.js");
const Razorpay = require("razorpay");
const paymentRouter = express.Router();
const uniqid = require("uniqid");
const util = require('util');
const connection = require("../db/connection.js");
const query = util.promisify(connection.query).bind(connection);


const razorpay = new Razorpay({
    key_id:"rzp_test_6nSOEARvqcDmof",
    key_secret:"13YCLiMwWGkSqZo49UgDIlID"
})    

paymentRouter.post("/order",verify,async(req,res)=>{
    console.log("payment is running!!!");
    const {amount} = req.body;
    console.log(amount);

    const options = {
        amount : amount * 100,
        currency:'INR',
        receipt:'test payment',
        payment_capture:1
    }

    const response = await razorpay.orders.create(options);

    const {user_id,username,email} = req.user;

    if(response){
        return res.status(201).send({
            success:true,
            order_id:response.id,
            amount : amount * 100,
            user:{
                user_id,
                username,
                email
            }
        })
    }
    else{
        return res.status(500).send({
            success:false,
            // order_id:response.id
        })
    }


})


paymentRouter.post("/verifyPayment",verify,async(req,res)=>{
    console.log(req.body);
    const {payment_id,order_id,signature} = req.body;

    const response = await razorpay.payments.fetch(payment_id);

    console.log(response);
    
    if(response.status === "captured" && response.captured === true){
        console.log("captured!!!");
        
        let mysql = `
        insert into payments 
        set ? 
        `
        
        const paymentObj = {
            payment_id:uniqid(),
            amount:response.amount,
            user_id:req.user.user_id,
        }
            
            const results = await query(mysql,paymentObj);
            // return res.render("products");
            console.log(results);

        mysql = `
            update orders
            set order_status = "paid"
            where user_id = "${req.user.user_id}";
        `    
        const orders = await query(mysql);
        console.log(orders);
        
        res.redirect("/products")

        }
    })
module.exports = paymentRouter;