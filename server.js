const dotenv = require("dotenv");
const path = require("path");
dotenv.config({path:"configs/backend.env"});
const express = require("express");
const app = express();
const { Server, Socket } = require("socket.io");
const PORT = process.env.port || 4000;
const connection = require("./db/connection.js");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/indexRouter.js");
const customerRouter = require("./routes/customerRouter.js");
const ordersRouter = require("./routes/ordersRouter.js");
const productsRouter = require("./routes/productsRouter.js");
const paymentRouter = require("./routes/paymentRouter.js");


const viewsPath = path.join(__dirname,"./views")
console.log(viewsPath);
const cssPath = path.join(__dirname,"./public/css");
console.log(cssPath);
const jsPath = path.join(__dirname,"./public/js");
console.log(jsPath);
const photosPath = path.join(__dirname,"./public/photos");
console.log(photosPath);
const uploadsPath = path.join(__dirname,"./uploads");
console.log(uploadsPath);



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
app.use("/js",express.static(jsPath));
app.use("/photos",express.static(photosPath));
app.use("/uploads",express.static(uploadsPath));
app.use("/",indexRouter);
app.use("/api/customer",customerRouter);
app.use("/api/orders",ordersRouter);
app.use("/api/products",productsRouter);
app.use("/api/payment",paymentRouter);



const server = app.listen(PORT,()=>{
    console.log("listening on port",PORT);
})

const io = new Server(server, { });


const {addToCart} = require("./socketControllers.js");
const socketHandler = require("./socketHandler.js");
io.on("connection", (socket) => {
    console.log("connected!!!");
    socket.on("join",({roomname})=>{
        socket.join(roomname);
    })
    socket.on("add__to__cart",({product_id,product_quantity,user_id})=>{
        // const {cartArray} = await addToCart({product_id,product_quantity,user_id});
        // console.log(cartArray);
        // socket.emit("addToCartSuccess",{cartArray});
        socketHandler(io,socket).addToCart({product_id,product_quantity,user_id})
    });
    socket.on("cancel__order",({order_id,user_id})=>{
        socketHandler(io,socket).cancelOrder({order_id,user_id})
    })
});

