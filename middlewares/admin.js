exports.isAdmin=async(req,res,next)=>{
    const admin = req.user;
    if(admin.email.includes("@admin.com")){
        req.isAdmin = true;
        next();
    }
}