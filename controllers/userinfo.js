const queryy = require("../functions/db_query");

exports.getuserinfo = (req, res) => {
    const {id_user}=req.decoded.user
  const sql =
    "select firstname,lastname,photo from user where id_user=?";
  queryy.sql_request(sql, [id_user], res);
};
