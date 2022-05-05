const connection = require("./db/connection.js");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);
const uniqid = require("uniqid");

function socketHandler(io, socket) {
  return {
    async addToCart({ product_id, product_quantity, user_id }) {
      console.log(product_id);
      console.log(product_quantity);
      console.log(user_id);
      const orderObj = {
        order_id: uniqid(),
        product_id,
        user_id,
        quantity: product_quantity,
        order_status: "unpaid",
      };

      let mysql = `
        insert into orders set ?
    `;
      const results = await query(mysql, orderObj);

      if (results.affectedRows !== 0) {
        let mysql = `
            select order_id,order_status,product_id,quantity from orders as o inner join customer as c on o.user_id = c.user_id where c.user_id = "${user_id}" and o.order_status="unpaid";
        `;
        const orders = await query(mysql);

        console.log(orders);

        let cartArray = [];

        let total_price = 0;

        for (let i = 0; i < orders.length; i++) {
          if(orders[i].order_status === "unpaid"){
            let mysql = `
                  select * from products
                  where product_id = "${orders[i].product_id}";
              `;
            const results = await query(mysql);
  
            let cartObj = {
              order_id: orders[i].order_id,
              product_id: results[0].product_id,
              product_name: results[0].product_name,
              product_description: results[0].product_description,
              product_quantity: orders[i].quantity,
              product_price: results[0].product_price,
              product_image: results[0].product_image,
            };
            // console.log(results);

            total_price = total_price + (cartObj.product_price * product_quantity);

            cartArray.push(cartObj);
          }
          else{
            console.log(orders[i]);
            console.log("failed in socket")
          }
        }

        mysql = `
          select user_id,username,email from customer;
        `
        const user = await query(mysql);

        io.to("orders").emit("addToCartSuccess", { cartArray,total_price ,user:{
          user_id:user[0].user_id,
          username:user[0].username,
          email:user[0].email
        } });
      }
    },
    async cancelOrder({order_id,user_id}){
      let mysql = `
        delete from orders
        where order_id = "${order_id}";
      `
      const results = await query(mysql);
      console.log(results);

      if(results.affectedRows!==0){

        mysql = `
        select order_id,order_status,product_id,quantity from orders as o inner join customer as c on o.user_id = c.user_id where c.user_id = "${user_id}" and o.order_status="unpaid";
        ` 
        const orders = await query(mysql);

        console.log(orders);

        let cartArray = [];

        let total_price = 0;

        for(let i=0;i<orders.length;i++){

          mysql = `
            select * from products
            where product_id = "${orders[i].product_id}";
          `
          const products = await query(mysql);

          let cartObj = {
            order_id: orders[i].order_id,
            product_id: products[0].product_id,
            product_name: products[0].product_name,
            product_description: products[0].product_description,
            product_quantity: orders[i].quantity,
            product_price: products[0].product_price,
            product_image: products[0].product_image,
          };
          total_price = total_price + (cartObj.product_price * cartObj.product_quantity);
          cartArray.push(cartObj);
        }

        console.log("user id is : ",user_id);

        mysql = `
          select user_id,username,email from customer;
        `
        const user = await query(mysql);

        console.log("cart array is ",cartArray);
        
       io.to("orders").emit("cancel__success",{cartArray,
        user:{
          user_id:user[0].user_id,
          username:user[0].username,
          email:user[0].email
        },
        total_price
        });

      }

    }
  };
}

module.exports = socketHandler;
