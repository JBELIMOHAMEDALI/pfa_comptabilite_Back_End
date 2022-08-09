const jwt = require('jsonwebtoken')
const {decryptToken} = require('../functions/encryption');
module.exports=(req,res,next)=>{
    try {
        const token = req.headers['authorization'].split(" ")[1]; 
        const decryptedToken=decryptToken(token);
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
