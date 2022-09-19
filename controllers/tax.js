const query = require("../functions/db_query");

exports.getTaxes = (req, res) => {
  const { id_user } = req.decoded.user;
  const { limit, offset } = req.query;
  const { id_company } = req.params;
  const sql = `select tax.* from tax 
    join user join company on 
      user.id_user=company.id_user and company.id_company=tax.id_company
       where user.id_user=${id_user} and tax.id_company=${id_company}
        LIMIT ${limit} OFFSET ${offset}`;
  query.sql_request(sql, null, res, true);
};

exports.insert = (req, res) => {
  const {
    name,
    description,
    agency_name,
    businessNo,
    start_period,
    filling_frequency,
    collection_type,
    id_company,
  } = req.body;
  const values = [
    [
      [
        name,
        description,
        agency_name,
        businessNo,
        start_period,
        filling_frequency,
        collection_type,
        id_company,
      ],
    ],
  ];
  const sql =
    "insert into tax (name,description, agency_name, businessNo, start_period, filling_frequency, collection_type,id_company) values ?";

  query.sql_request(sql, values, res);
};

exports.update = (req, res) => {
  const {
    name,
    description,
    agency_name,
    businessNo,
    start_period,
    filling_frequency,
    collection_type,
    id_company,
    id,
  } = req.body;
  const values = [
    name,
    description,
    agency_name,
    businessNo,
    start_period,
    filling_frequency,
    collection_type,
    id_company,
    id,
  ];
  const sql =
    "UPDATE tax SET name = ? , description = ? , agency_name = ? , businessNo = ? ,start_period = ? , filling_frequency = ? , collection_type = ? ,id_company=? WHERE id = ?";
  query.sql_request(sql, values, res);
};

exports.delete = (req, res) => {
  const values = [req.params.id];
  const sql = "delete from tax where id = ?";
  query.sql_request(sql, values, res);
};



// (SELECT COUNT(*) FROM tax
// join user join company on 
//   user.id_user=company.id_user and company.id_company=tax.id_company
//    where user.id_user=${id_user} and tax.id_company=${id_company}) 
//    AS totalItems,