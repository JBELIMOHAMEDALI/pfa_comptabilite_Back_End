const query = require("../functions/db_query");

exports.getTransactions = (req, res) => {
  const { limit, offset } = req.query;
  const sql = `SELECT (count(*) OVER()) AS totalItems ,
  p.* from product p join company c join suppliers s JOIN accounting_plan ac   
 on p.id_company=c.id_company and p.id_suppliers=s.id and p.id_accounting_plan = ac.id
 where p.id_company= ${req.params.id_company}
 LIMIT ${limit} OFFSET ${offset}`;
  query.sql_request(sql, null, res, true);
};
