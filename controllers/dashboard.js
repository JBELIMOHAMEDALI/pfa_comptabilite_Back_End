const queryy =require("../functions/db_query");



exports.get=(req,res)=>{
    console.log('api called');
    return res.json({
        stats:true
    })
};