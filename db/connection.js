const mysql = require("mysql");
console.log(process.env.db_user);

const connection = mysql.createConnection({
  host:process.env.db_host,
  user:process.env.db_user,
  password:process.env.db_password,
  database:process.env.db_database,
});

const createTable=(query)=>{
  connection.query(query,(err,results,fields)=>{
    if(!err){
      console.log(results);
    }
    else{
      console.log(err);
    }
});
}

// * creating the customer table
let query = `create table IF NOT EXISTS customer(
  user_id varchar(200) primary key,
  username varchar(25),
  email varchar(200),
  password varchar(250)
);`
createTable(query)

// * creating the products table
query = `create table IF NOT EXISTS products(
  product_id varchar(200) primary key,
  product_name varchar(200),
  product_image text,
  product_description text,
  product_price int
  );`
  
  createTable(query)

// * creating the orders table
query = `create table IF NOT EXISTS orders(
      order_id varchar(200) primary key,
      product_id varchar(200),
      user_id varchar(200), 
      quantity INT,
      order_status varchar(25),
      foreign key(product_id) references products(product_id),
      foreign key(user_id) references customer(user_id)
    );`

createTable(query);

query = `
create table IF NOT EXISTS jwt_tokens(
  token_id varchar(200) primary key,
  token text,
  user_id varchar(200),
  email varchar(200),
  foreign key(user_id) references customer(user_id)
  );
  `
createTable(query);


query = `
create table IF NOT EXISTS payments(
  payment_id varchar(200) primary key,
  amount INT,
  user_id varchar(200),
  foreign key(user_id) references customer(user_id)
  );
`
    
createTable(query);
          
// connection.end();
module.exports = connection;