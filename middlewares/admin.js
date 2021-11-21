exports.isAdmin=async(req,res,next)=>{
    // console.log(req.file);
    // console.log(req.body);
    const admin = req.user;
    if(admin.email.includes("@admin.com")){
        req.isAdmin = true;
        next();
    }
}