const jwt = require('jsonwebtoken')
const encryptToken = require('../middleware/encryptToken');
module.exports=(req,res,next)=>{
    try {
        const token = req.headers['authorization'].split(" ")[1]; 
        const decryptedToken=encryptToken.decrypt(token);
        const decoded=jwt.verify(decryptedToken,process.env.ACCESS_TOKEN);
        req.userData=decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message:'Forbidden ! ',
            err:true
        })
    }
}
