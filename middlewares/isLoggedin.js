const isLoggedin=async(req,res,next)=>{
    if(req.cookies.authToken === undefined){    
        next();
    }
    else{
        return res.render("products")
    }
}
module.exports =  isLoggedin;