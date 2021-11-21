exports.getAllOrders=async(req,res)=>{
    try{
        console.log(req.user);

    }catch(err){
        res.status(500).send({
            success:false,
            message:"internal server error!!"
        })
    }
}