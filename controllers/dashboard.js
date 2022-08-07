const queryy =require("../middleware/db_query");



exports.get=(req,res)=>{
    // const sql="select * from societe";
    return res.json({
        stats:true
    })
};