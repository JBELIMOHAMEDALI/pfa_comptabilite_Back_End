const query = require("../functions/db_query");

exports.getCustomers = (req, res) => {
  const { id_user } = req.decoded.user;
  const { limit, offset } = req.query;
  const sql = `select 
  
  (SELECT COUNT(*) FROM customer
  join user join company on 
    user.id_user=company.id_user and company.id_company=customer.id_company
     where user.id_user=${id_user}) 
     AS totalItems,
     
     customer.* from customer 
  join user join company on 
    user.id_user=company.id_user and company.id_company=customer.id_company
     where user.id_user=${id_user} LIMIT ${limit} OFFSET ${offset}`;
  query.sql_request(sql, null, res, true);
};

exports.insert = (req, res) => {
  const {
    fullname,
    address,
    email,
    phone,
    company_name,
    payment_method,
    id_company
  } = req.body;
  const values = [
    [
      [fullname,
        address,
        email,
        phone,
        company_name,
        payment_method,
        id_company
      ]
    ]
  ];

  const sql = `INSERT INTO customer(fullname,email,phone address,company_name,payment_method,id_company) VALUES ?`;

  query.sql_request(sql, values, res);
};
//
exports.update = (req, res) => {
    const {
        fullname,
        address,
        email,
        phone,
        company_name,
        payment_method,
        id_company,
        id
      } = req.body;
      const values = [
        
          fullname,
            address,
            email,
            phone,
            company_name,
            payment_method,
            id_company,
            id
      ];
  const sql = `UPDATE customer SET fullname = ?, address = ?, email = ?,company_name = ?,payment_method = ?
    WHERE id = ?`;
  query.sql_request(sql, values, res);
};

exports.delete = (req, res) => {
  const values = [req.params.id];
  const sql = "delete from customer where id = ?";
  query.sql_request(sql, values, res);
};