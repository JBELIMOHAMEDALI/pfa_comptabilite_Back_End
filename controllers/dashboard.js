const queryy =require("../functions/db_query");



exports.get=(req,res)=>{
    // const sql="select * from societe";
    return res.json({
        stats:true
    })
};