let socket = io();
socket.emit("join",{roomname:"orders"});

const quantity_inc_buttons = document.querySelectorAll('.quantity_inc');
// console.log(quantity_inc_buttons);
const quantity_dec_buttons = document.querySelectorAll('.quantity_dec');
// console.log(quantity_dec_buttons);
const quantity = document.querySelectorAll("#quantity")
// console.log(quantity);
let quantity_count = 1;
const add__to__cart__buttons = document.querySelectorAll(".add__to__cart");
// console.log(add__to__cart__buttons);
const cancle_buttons = document.querySelectorAll(".cancel__order");
console.log(cancle_buttons);
const confirm__order__button = document.querySelector(".confirm__order__button");

// document.addEventListener("DOMContentLoaded",()=>{
    // ! cancel order
    cancle_buttons.forEach((btn)=>{
        btn.addEventListener('click',()=>{
            console.log("cancel clicked!!")
            socket.emit("cancel__order",{order_id:btn.dataset.order_id,user_id:btn.dataset.user_id});
        })
    })
// })



// var rzp1 = new Razorpay(options);
// document.getElementById('rzp-button1').onclick = function(e){
//     rzp1.open();
//     e.preventDefault();
// }






quantity_inc_buttons.forEach((btn,index)=>{
    console.log(btn);
    btn.addEventListener("click",(e)=>{
        quantity_count = quantity_count + 1;
        // console.log(quantity_count);
        // console.log(quantity[index]);
        quantity[index].innerHTML = `${quantity_count}`;
    })
})

quantity_dec_buttons.forEach((btn,index)=>{
    console.log(btn);
    btn.addEventListener("click",(e)=>{
        if(quantity_count!==1){
            quantity_count = quantity_count - 1;
            // console.log(quantity_count);
            // console.log(quantity[index]);
            quantity[index].innerHTML = `${quantity_count}`;
        }
    })
})


add__to__cart__buttons.forEach((btn,index)=>{
    btn.addEventListener("click",()=>{
        console.log(btn.dataset);
        socket.emit("add__to__cart",{product_id:btn.dataset.product_id,product_quantity:quantity_count,user_id:btn.dataset.user_id});
        quantity_count = 1;
        quantity[index].innerHTML = `${quantity_count}`;
    })
})


const cart = document.querySelector(".cart");

const paymnet_button = document.querySelector('#payment_button');

var total_cart_amount = 0;

socket.on("addToCartSuccess",({total_price,cartArray,user})=>{
   console.log(cartArray);
//    globalCartArray = [...cartArray];

    total_cart_amount = total_cart_amount + total_price;
    // confirm__order__button.innerHTML = "";
    confirm__order__button.innerHTML = `pay <span>${total_cart_amount} ₹</span>`

   cart.innerHTML = "";
   cartArray.forEach((product)=>{
       const card = document.createElement('div');
       card.className = "cartCard"
       const img = `http://localhost:5000/uploads/${product.product_image}`
       card.innerHTML = `
       <div class="cart__img__div">
       <img src=${img}>
    </div>
    <div class="cart_product__info">
       <h4>${product.product_name}</h4>
       <h4>${product.product_description}</h4>
       <h4>${product.product_price}</h4>
       <h4>${product.product_quantity}</h4>
    </div>
    <div class="cart_total">
       <h2>${product.product_quantity * product.product_price }</h2>
    </div>
    <button class="cancel__order" data-order_id =${product.order_id} data-user_id=${user.user_id}>cancel</button>
       `
       cart.appendChild(card);
   })
})

socket.on("cancel__success",({total_price,cartArray,user})=>{
    console.log(cartArray);
    // globalCartArray = [...cartArray];
    total_cart_amount = total_price;
    // confirm__order__button.innerHTML = "";
    confirm__order__button.innerHTML = `pay <span>${total_cart_amount} ₹</span>`
    cart.innerHTML = "";
   cartArray.forEach((product)=>{
       const card = document.createElement('div');
       card.className = "cartCard"
       const img = `http://localhost:5000/uploads/${product.product_image}`
       card.innerHTML = `
       <div class="cart__img__div">
       <img src=${img}>
    </div>
    <div class="cart_product__info">
       <h4>${product.product_name}</h4>
       <h4>${product.product_description}</h4>
       <h4>${product.product_price}</h4>
       <h4>${product.product_quantity}</h4>
    </div>
    <div class="cart_total">
       <h2>${product.product_quantity * product.product_price }</h2>
    </div>

    <button class="cancel__order" data-order_id = ${product.order_id} data-user_id= ${user.user_id}>cancel</button>`
       cart.appendChild(card);
   })
})





confirm__order__button.addEventListener('click',async(e)=>{

    total_cart_amount = e.target.dataset.total_payment;    

    console.log("order placed!!");

    var options = {
        "key": "rzp_test_6nSOEARvqcDmof", // Enter the Key ID generated from the Dashboard
        "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "grocey management system",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
        "handler": async function(response){
            console.log(response.razorpay_payment_id);
            console.log(response.razorpay_order_id);
            console.log(response.razorpay_signature);

            await fetch("/api/payment/verifyPayment",{
                method:"post",
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    payment_id:response.razorpay_payment_id,
                    order_id:response.razorpay_order_id,
                    signature:response.razorpay_signature
                })
            })


        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            // "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };


    const res = await fetch("/api/payment/order",{
        method:"post",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            amount:total_cart_amount
        })
    })

    const data = await res.json();

    console.log(data);

    if(data){
        options.order_id = data.order_id;
        options.amount = data.amount;
        options.prefill.name = data.user.username;
        options.prefill.email = data.user.email;
        var rzp1 = new Razorpay(options);

        rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });

        rzp1.open();
    e.preventDefault();
    }

})
