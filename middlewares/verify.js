const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const connection = require("../db/connection.js");
const util =require("util");
const query = util.promisify(connection.query).bind(connection);

const verify = async(req,res,next)=>{
    // try{    
        let jwtToken;
        let tokenObj;
        console.log(req.cookies);
        if(req.cookies.authToken!==undefined){
            jwtToken = req.cookies.authToken;
            tokenObj = jwt_decode(jwtToken);
        }
        else{
            return res.render("login");
        }
        console.log(tokenObj);
        if(tokenObj.exp * 1000 > new Date().getTime() && req.cookies.authToken!==null){

            // const {user_id,email} = jwt.verify(jwtToken);
            const obj = jwt.verify(jwtToken,process.env.JWT_SECRET_KEY);
            console.log(obj);
            const mysql = `select * from customer
                where user_id = "${obj.user_id}" and email="${obj.email}";
            `
            const users = await query(mysql);
            
            if(users.length === 0){
                return res.status(401).send({
                    success:false,
                    message:"you are unauthorized!!"
                })
            }
            else{
               req.user = users[0];  
               next();
            }
        }   
        else{
            // return res.status(401).send({
            //     status:false,
            //     message:"you are unauthorized"
            // })

            return res.render("login")
        }
    }   
    // catch(err){
    //     return res.status(500).send({
    //         status:false,
    //         message:"internal server error"
    //     })
    // }
// }

module.exports = verify;