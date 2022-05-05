const connection = require("./db/connection.js");
const util = require('util');
const query = util.promisify(connection.query).bind(connection);
const uniqid = require("uniqid");
exports.addToCart=async({product_id,product_quantity,user_id})=>{
    console.log(product_id);
    console.log(product_quantity);
    console.log(user_id);
    const orderObj={    
        order_id : uniqid(),
        product_id,
        user_id,
        quantity:product_quantity,
        order_status:"unpaid"
    }

    let mysql = `
        insert into orders set ?
    `
    const results = await query(mysql,orderObj);
        
    if(results.affectedRows!==0){
        let mysql = `
            select order_id,product_id,quantity from orders as o inner join customer as c on o.user_id = c.user_id;
        `
        const orders = await query(mysql);


        let cartArray = []
        
        for(let i=0;i<orders.length;i++){
            let mysql = `
                select * from products
                where product_id = "${orders[i].product_id}";
            `
            const results = await query(mysql);

            let cartObj = {
                order_id:orders[i].order_id,
                product_id:results[0].product_id,
                product_name : results[0].product_name,
                product_description : results[0].product_description,
                product_quantity:orders[i].quantity,
                product_price:results[0].product_price,
                product_image:results[0].product_image
            }
            // console.log(results);
            cartArray.push(cartObj);
        }
        // console.log(orders);
        // console.log(products);
        // socket.emit("addToCartSuccess",{cartArray})
        return {
            cartArray
        }
    }
    
}