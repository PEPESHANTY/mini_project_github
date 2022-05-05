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
                })
                
                res.render("admin");
            }
            else{

                let mysql = `
                    select * from products;
                `
                const products = await query(mysql);
                console.log("these are products!!",products);

                // res.cookie("authToken",jwtToken,{
                //     maxAge:new Date().getTime() + 60 * 60 * 60 * 24 * 7 * 1000,
                //     httpOnly:true
                // })

                // res.render("products",{
                //     products,
                //     user_id:users[0].user_id
                // });

                res.redirect("/products");

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

        console.log("user login is working!!!");

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
                    let mysql = `
                    select * from products;
                `
                    const products = await query(mysql);
                    console.log("products are ",products);

                    res.cookie("authToken",jwtToken,{
                        maxAge:new Date().getTime() + (60 * 60 * 60 * 24 * 7 )/ 1000,
                        httpOnly:true
                    }).render("products",{
                        products
                    });
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

exports.userLogout=async(req,res)=>{
    console.log(req.user);

    let mysql ="";
    let tokens = "";
    if(req.cookies.authToken){
        mysql = `
            select * from jwt_tokens
            where token = "${req.cookies.authToken}";
        `
        tokens = await query(mysql);
    }

    if(tokens.length!==0){
        mysql = `
            delete from jwt_tokens
            where user_id = "${req.user.user_id}" and email="${req.user.email}";
        `
        const results = await query(mysql);
        console.log(results);
        if(results){
            res.clearCookie("authToken")
            res.redirect("/login");
        }
    }




}