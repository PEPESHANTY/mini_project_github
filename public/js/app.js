const quantity_inc_buttons = document.querySelectorAll('.quantity_inc');
// console.log(quantity_inc_buttons);
const quantity_dec_buttons = document.querySelectorAll('.quantity_dec');
// console.log(quantity_dec_buttons);
const quantity = document.querySelectorAll("#quantity")
// console.log(quantity);
let quantity_count = 1;
const add__to__cart__buttons = document.querySelectorAll(".add__to__cart");
// console.log(add__to__cart__buttons);


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




let socket = io();

add__to__cart__buttons.forEach((btn)=>{
    btn.addEventListener("click",()=>{
        socket.emit("add__to__cart",{product_id:btn.dataset.product_id})
    })
})