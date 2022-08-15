const query = require("../functions/db_query");
const dbClient = require("../config/db_config");

exports.getUserCompanies = (req, res) => {
  const { id_user } = req.decoded.user;
  const values = [id_user];
  let sql;
  if (req.query.lilmit) {
    sql =
      "select * from company join user on user.id_user=company.id_user where user.id_user=? LIMIT ? OFFSET ?";
    const { limit, offset } = req.query;
    values.push(limit);
    values.push(offset);
  } else {
    sql =
      "select * from company join user on user.id_user=company.id_user where user.id_user=?";
  }
  query.sql_request(sql, values, res);
};

exports.getSelectedCompany = (req, res) => {
  const { id_user } = req.decoded.user;
  const sql =
    "select id_company from company join user on user.id_user=company.id_user where user.id_user=? AND selected = ?";
  query.sql_request(sql, [id_user, "1"], res);
};

exports.insert = (req, res) => {
  const { id_user } = req.decoded.user;

  const { name, domain } = req.body;
  const values = [[[name, domain, id_user]]];
  //
  const sql = "INSERT INTO company(name, domain,id_user) VALUES ?";

  query.sql_request(sql, values, res);
};
//
exports.update = (req, res) => {
  const { name, domain, id_company } = req.body;
  const { id_user } = req.decoded.user;

  const values = [name, domain, id_company, id_user];
  const sql =
    "UPDATE company SET name = ?, domain = ? WHERE id_company = ? and id_user =?";
  query.sql_request(sql, values, res);
};

exports.delete = (req, res) => {
  const { id_user } = req.decoded.user;

  const values = [req.params.id, id_user];
  const sql = "delete from company where id_company = ? and id_user=?";
  query.sql_request(sql, values, res);
};

exports.setSelected = (req, res) => {
  const { id_company } = req.params;
  const { id_user } = req.decoded.user;
  let sql =
    "UPDATE company SET selected=? WHERE id_company <> ? and id_user =? and selected=?";

  dbClient.query(sql, ["0", id_company, id_user, "1"], (err, rows) => {
    if (!err) {
      sql = "UPDATE company SET selected=? WHERE id_company = ? and id_user =?";

      query.sql_request(sql, ["1", id_company, id_user], res);
    } else
      return res.status(500).json({
        err: true,
        message: "Operation not performed! Try again later",
      });
  });
};

exports.verifySelectedCompany = (req, res) => {
  const { id_user } = req.decoded.user;
  const sql =
    "select id_company from company join user on user.id_user=company.id_user where user.id_user=? AND selected = ?";
  query.sql_request(sql, [id_user, "1"], res);
};
