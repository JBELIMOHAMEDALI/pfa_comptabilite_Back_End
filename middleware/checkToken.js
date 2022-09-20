const jwt = require('jsonwebtoken')
module.exports=(req,res,next)=>{
    try {
        const token = req.headers['authorization'].split(" ")[1]; 
        console.log(jwt.verify(token,process.env.ACCESS_TOKEN_SECRET));
        const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.decoded=decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message:'Forbidden ! ',
            err:true,
            message:error.message
        })
    }
}
