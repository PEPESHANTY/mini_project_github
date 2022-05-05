const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const connection = require("../db/connection.js");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

const isLoggedin=async(req,res,next)=>{
    if(req.cookies.authToken === undefined){
        // console.log(req.cookies.authToken);
        console.log("is logged in working!!");    
        next();
    }
    else if(req.cookies.authToken){
        const tokenObj = jwt_decode(req.cookies.authToken);
        if(tokenObj.exp * 1000 > new Date().getTime()){
            
            let mysql = `
                select * from jwt_tokens
                where token = "${req.cookies.authToken}";
            `
            const tokens = await query(mysql);

            mysql = `
                    select * from customer
                    where user_id = "${tokenObj.user_id}"
                    `
            const users = await query(mysql);

            if(tokens.length!==0 && users.length!==0){ 

                mysql = `
                    select * from products;
                `
                const products = await query(mysql);

                console.log("products in isloggedin are",products);

                // res.render("products",{
                //     products,
                //     user_id:users[0].user_id
                // });
                return res.redirect("/products");
            }
            else{
                next();
            }

        }else{
            next();
        }
        

    }
}
module.exports =  isLoggedin;