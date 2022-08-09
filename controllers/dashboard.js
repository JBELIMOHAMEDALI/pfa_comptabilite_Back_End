const queryy =require("../functions/db_query");



exports.get=(req,res)=>{
    return res.json({
        stats:true
    })
};