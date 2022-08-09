const jwt = require('jsonwebtoken')
const {decryptToken} = require('../functions/encryption');
module.exports=(req,res,next)=>{
    try {
        const token = req.headers['authorization'].split(" ")[1]; 
        const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.decoded=decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message:'Forbidden ! ',
            err:true,
            message:error.message
        })
    }
}
