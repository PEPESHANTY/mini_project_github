const connection = require("../db/connection.js");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

exports.getAllProducts=async(req,res)=>{
    try{
        let mysql = `
            select * from products;
        `
        const products = await query(mysql);
        if(products.length === 0){
            return res.status(404).send({
                success:false,
                message:"products not found!!"
            })
        }
        else{
            res.status(200).send({
                success:true,
                products
            })
        }
    }   
    catch(err){
        res.status(500).send({
            status:false,
            message:"internal server error!!!"
        })
    }
}

exports.createProduct=async(req,res)=>{
    try{
        console.log(req.files[0]);
        console.log(req.body);
    }
    catch(err){

    }
}