exports.isAdmin=async(req,res,next)=>{
    // console.log(req.file);
    // console.log(req.body);
    if(req.user){
        const admin = req.user;
        if(admin.email.includes("@admin.com")){
            req.isAdmin = true;
            next();
        }
    }
    else{
        if(req.body.email.includes("@admin.com")){
            req.isAdmin = true;
            next();
        }
    }
}