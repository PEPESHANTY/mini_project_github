const bcrypt = require("bcryptjs");
class bcryptService{
    async hashPassword(password){
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password,salt);
        return hashedPassword;
    }
    async comparePassword(userEnteredPassword,password){
        const compare = await bcrypt.compare(userEnteredPassword,password);
        return compare;
    }
}

module.exports = bcryptService;