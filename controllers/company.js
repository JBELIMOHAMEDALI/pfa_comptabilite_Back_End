const query = require("../functions/db_query");

exports.getUserCompanies = (req, res) => {
    const {id_user}=req.decoded.user;
  const sql =
    "select company.* from company join user on user.id_user=company.id_user where user.id_user=?";
  query.sql_request(sql, [id_user], res);
};


exports.insert = (req, res) => {
  const {id_user}=req.decoded.user;

  const { name, domain } = req.body;
  const values = [[[name, domain,id_user]]];
  //
  const sql = "INSERT INTO company(name, domain,id_user) VALUES ?";

  query.sql_request(sql, values, res);
};
//
exports.update = (req, res) => {
  const { name, domain, id_company } = req.body;
  const {id_user}=req.decoded.user;

  const values = [name, domain, id_company,id_user];
  const sql =
    "UPDATE company SET name = ?, domain = ? WHERE id_company = ? and id_user =?";
  query.sql_request(sql, values, res);
};

exports.delete = (req, res) => {
  const {id_user}=req.decoded.user;

  const values = [req.params.id,id_user];
  const sql = "delete from company where id_company = ? and id_user=?";
  query.sql_request(sql, values, res);
};
