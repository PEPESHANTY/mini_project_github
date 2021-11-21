const dotenv = require("dotenv");
const path = require("path");
dotenv.config({path:"configs/backend.env"});
const express = require("express");
const app = express();
const PORT = process.env.port || 4000;
const connection = require("./db/connection.js");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/indexRouter.js");
const customerRouter = require("./routes/customerRouter.js");
const ordersRouter = require("./routes/ordersRouter.js");
const productsRouter = require("./routes/productsRouter.js");


const viewsPath = path.join(__dirname,"./views")
console.log(viewsPath);
const cssPath = path.join(__dirname,"./public/css");
console.log(cssPath);
const photosPath = path.join(__dirname,"./public/photos");
console.log(photosPath);



// * connection to mysql
connection.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("connection successfull!!");
    }
});

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.set("view engine","ejs");
app.set("views",viewsPath);
app.use("/css",express.static(cssPath));
app.use("/photos",express.static(photosPath));
app.use("/",indexRouter);
app.use("/api/customer",customerRouter);
app.use("/api/orders",ordersRouter);
app.use("/api/products",productsRouter);


app.listen(PORT,()=>{
    console.log("listening on port",PORT);
})