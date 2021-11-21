const connection = require("../db/connection.js");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);
const uniqid = require("uniqid");

exports.getAllProducts = async (req, res) => {
  try {
    let mysql = `
            select * from products;
        `;
    const products = await query(mysql);
    if (products.length === 0) {
      return res.status(404).send({
        success: false,
        message: "products not found!!",
      });
    } else {
      res.status(200).send({
        success: true,
        products,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "internal server error!!!",
    });
  }
};

exports.createProduct = async (req, res) => {
    console.log(req.file);
    console.log(req.body);
    const { product_name, product_price, product_description } = req.body;
    const productObj = {
        product_id :uniqid(),
        product_name,
        product_price,
        product_description,
        product_image : req.file.filename
    }
    try {
        let mysql = `
            insert into products set ?
        `
        const results = await query(mysql,productObj);

        if(results.affectedRows!==0){
            res.status(201).send({
                success:true,
                message:"product created successfully"
            })
        }
        else{
            res.status(400).send({
                success:false,
                message:"product creation failed!!"  
            })
        }

  } 
  catch (err) {
      res.status(500).send({
          success:false,
          message:"internal server error!!"
      })

  }
};
