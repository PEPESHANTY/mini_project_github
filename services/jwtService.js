const jwt = require("jsonwebtoken");

class jwtService{
    constructor(){
        this.secretKey = process.env.JWT_SECRET_KEY
    }
    jwtSign(user_id,email){
        const token = jwt.sign({user_id,email},this.secretKey,{
            expiresIn:"7d"
        })
        return token;
    }
    jwtVerify(token){
        const verified = jwt.verify(token.this.secretKey);
        return verified;
    }
}

module.exports = jwtService;