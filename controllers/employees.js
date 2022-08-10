const query = require("../functions/db_query");

exports.getUserEmployees = (req, res) => {
  const { id_user } = req.decoded.user;
  const sql = `select employee.* from employee join user on 
    user.id_user=company.id_user and company.id_company=employee.id_company
     where user.id_user=?`;
  query.sql_request(sql, [id_user], res);
};

exports.insert = (req, res) => {
  const { fullname, address,email,phone,salary,gender,hire_date,birthdate,id_company} = req.body;
  const values = [[[fullname, address,email,phone,salary,gender,hire_date,birthdate,id_company]]];

  const sql =`INSERT INTO employee(fullname, address,email,phone,salary,gender,hire_date,birthdate,id_company) VALUES ?`;

  query.sql_request(sql, values, res);
};
//
exports.update = (req, res) => {
  const { fullname, address, email, phone,salary,gender,hire_date,birthdate,id_employee } = req.body;
  const { id_user } = req.decoded.user;

  const values = [fullname, address, email, phone,salary,gender,hire_date,birthdate,id_employee,id_user];
  const sql =`UPDATE employee SET fullname = ?, address = ?, email = ?,phone = ?,salary = ?,gender=?,hire_date=?,birthdate=?,id_company=? 
    WHERE id_employee = ? and id_user =?`;
  query.sql_request(sql, values, res);
};

exports.delete = (req, res) => {
  const { id_user } = req.decoded.user;

  const values = [req.params.id, id_user];
  const sql = "delete from employee where id_employee = ? and id_user=?";
  query.sql_request(sql, values, res);
};
