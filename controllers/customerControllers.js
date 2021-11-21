const connection = require("../db/connection.js");
const util = require('util');
const uniqid = require('uniqid');
const jwtService = require("../services/jwtService.js");
const bcryptService = require("../services/bcryptService.js");
const query = util.promisify(connection.query).bind(connection);


exports.userSignup=async(req,res)=>{
    const {username,email,password} = req.body;
    console.log(req.body);
    const userObj={
        user_id:uniqid(),
        username,
        email,
        password
    }
    console.log(req.body);
    let mysql = 
    `
    select * from customer 
    where email = "${email}" and username="${username}"
    
    `
    const users = await query(mysql);
    if(users.length === 0){

        const bcryptObj = new bcryptService();
        const hashedPassword = await bcryptObj.hashPassword(password);
        userObj.password = hashedPassword;

        mysql = `
            insert into customer
            set ?
        `
        const user = await query(mysql,userObj);
        console.log(user);

        mysql = `
        insert into jwt_tokens set ?
        `
        const jwtObj = new jwtService();
        const jwtToken = jwtObj.jwtSign(userObj.user_id,userObj.email);
        
        const tokenObj = {
            token_id:uniqid(),
            token:jwtToken,
            user_id:userObj.user_id,
            email:userObj.email
        }

        const tokens = await query(mysql,tokenObj);
        console.log(tokens);


        if(user.affectedRows!== 0){
            if(userObj.email.includes("@admin.com")){
                res.cookie("authToken",jwtToken,{
                    maxAge:new Date().getTime() + 60 * 60 * 60 * 24 * 7 * 1000,
                    httpOnly:true
                }).render("admin");
            }
            else{
                res.cookie("authToken",jwtToken,{
                    maxAge:new Date().getTime() + 60 * 60 * 60 * 24 * 7 * 1000,
                    httpOnly:true
                }).render("home");
            }
        }
    }
    else{
        res.status(403).send({
            success:false,
            message:"user already exists!!"
        })
    }
}

exports.userLogin=async(req,res)=>{
    try{
        const {email,password} = req.body;
        console.log(req.body);

        let mysql = `select * from customer
            where email = "${email}";
        `
        const users = await query(mysql);

        const bcryptObj = new bcryptService();
        const compare = await bcryptObj.comparePassword(password,users[0].password);

        // console.log(users[0].email);

        if(users.length === 0 && !compare){
            return res.status(404).send({
                success:false,
                message:"user not found!!"
            })
        }
        else{
            const jwtObj = new jwtService();
            const jwtToken = jwtObj.jwtSign(users[0].user_id,users[0].email);
            
            const tokenObj={
                token_id:uniqid(),
                token:jwtToken,
                user_id:users[0].user_id,
                email:users[0].email
            }
            mysql = `
                insert into jwt_tokens set ?
            `
            const result = await query(mysql,tokenObj);
            console.log(result);

            if(result.affectedRows!==0){
                if(req.isAdmin === true){
                    res.cookie("authToken",jwtToken,{
                        maxAge:new Date().getTime() + (60 * 60 * 60 * 24 * 7)/1000 ,
                        httpOnly:true
                    }).render("admin")
                }
                else{
                    res.cookie("authToken",jwtToken,{
                        maxAge:new Date().getTime() + (60 * 60 * 60 * 24 * 7 )/ 1000,
                        httpOnly:true
                    }).render("home");
                }
            }

        }

    }
    catch(err){
        res.status(500).send({
            success:false,
            message:"internal server error!!"
        })
    }
}