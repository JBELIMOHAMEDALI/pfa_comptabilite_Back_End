const queryy = require("../functions/db_query");

exports.getUserCompanies = (req, res) => {
    const {id_user}=req.decoded.user;
  const sql =
    "select company.* from company join user on user.id_user=company.id_user where user.id_user=?";
  queryy.sql_request(sql, [id_user], res);
};


exports.insert = (req, res) => {
  const { nom_societe, domaine_societe } = req.body;
  const values = [[[nom_societe, domaine_societe]]];
  //
  const sql = "INSERT INTO societe(nom_societe, domaine_societe) VALUES ?";

  queryy.sql_request(sql, values, res);
};
//
exports.update = (req, res) => {
  const { nom_societe, domaine_societe, id_societe } = req.body;

  const values = [nom_societe, domaine_societe, id_societe];
  const sql =
    "UPDATE societe SET nom_societe = ?, domaine_societe = ? WHERE id_societe = ?";
  queryy.sql_request(sql, values, res);
};

exports.delete = (req, res) => {
  const values = [req.params.id];
  const sql = "delete from societe where id_societe = ?";
  queryy.sql_request(sql, values, res);
};
