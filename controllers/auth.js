const bcrypt = require("bcrypt");
const dbClient = require("../db_connection");
const jwt = require("jsonwebtoken");
const mailer = require("../middleware/mailer");
const encryption = require("../middleware/encryption");

exports.validate = (req, res) => {
  const crypted_user = req.params.hasheduser;
  let sql = "";
  try {
    sql = "select * from user where crypted = ? and actif = ?";
    dbClient.query(sql, [crypted_user, "0"], (err, rows) => {
      if (err) 
        return res.status(500).json({
          err: true,
          message: 'Operation not performed ! Try again later',
        });
      
        if (rows.length === 1) {
          const { lastname, firstname } = rows[0];
          sql = `UPDATE USER SET actif=?,crypted=? where crypted=?`;
          return query.sql_request(
            sql,
            ["1", crypted_user+";"+encryption.encryptData(lastname )+";"+ encryption.encryptData(firstname ), crypted_user],
            res
          );
        } else 
          return res.status(404).json({
            err: true,
            message: "Account activation failed ! Try again later",
          });
       
    });
  } catch (error) {
    return res.status(500).json({
      err: true,
      message: error.message,
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  let sql = `SELECT DISTINCT user.* from user where USER.email=? AND USER.actif=?`;

  dbClient.query(sql, [email, "1"], (err, rows) => {
    if(err){
      return res.status(500).json({
        err: true,
        message: "An error occured in server !  ",
      });
    }
      if (rows.length == 1) {
        bcrypt.compare(password, rows[0].password, (err, same) => {
          if (err) {
            return res.status(500).json({
              err: true,
              message: "An error occured in server !  ",
            });
          }
          if (same) {
           
                sql = `    
                  SELECT DISTINCT user.*,company.* 
                  FROM user JOIN company 
                  ON company.id_user=user.id_user                  
                  where user.email=?
              `;
                dbClient.query(sql, [email], (err, rows) => {
                  if (!err) {
                    const {
                      id_user,
                      id_company,
                      crypted,                      
                    } = rows[0];
                    const payload = {
                      id_user,
                      id_company,
                      crypted,  
                    };
                    const token = jwt.sign(
                      {
                        userData: payload,
                      },
                      process.env.JWT_USER_KEY,
                      { expiresIn: "7d" }
                    );
                    return res.status(200).json({
                      err: false,
                      message: "Auth successfull !",
                      token: token,
                    });
                  }else{
                    return res.status(500).json({
                      err: true,
                      message: "Auth failed ! Check email AND/OR password ",
                    });
                  }
                });
              
                  }else{
                    return res.status(500).json({
                      err: true,
                      message: "An error occured in server !  ",
                    });
                  }
                });              
            }
          else{
            return res.status(404).json({
              err: true,
              message: "Auth failed ! Check email AND/OR password ",
            });
          }
        });
};

exports.signup = (req, res) => {
  const {
    email,
    password,
    firstname,
    lastname,
    birthdate,
  } = req.body;
  let sql = "";
  sql = "select * from user where email = ? ";
  dbClient.query(sql, [email], (err, rows) => {
    if (!err) {
      if (rows.length > 0) {
        return res.status(409).json({
          //conflict
          err: true,
          message: "This email address exists already ! ",
        });
      } else {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({
              err,
              message: "error in hashing password !",
            });
          }
          const encryptedMail = encryption.encryptData(email);
          const mailPayload = {
            receivers: email,
            subject: "ACOUNT VERIFICATION",
            text: `Hi ${lastname+ " "+firstname} , Please activate your account via this url 
                ${process.env.CORS_ORIGIN}/account/${encryptedMail}`,
          };
          mailer(mailPayload)
            .then((result) => {
              dbClient.query(
                "INSERT INTO user(lastname,firstname,birthdate,email,password,crypted) VALUES ?",
                [
                  [
                    [
                      lastname.charAt(0).toUpperCase() + lastname.slice(1),
                      firstname.charAt(0).toUpperCase() + firstname.slice(1),
                      email,
                      hashedPassword,
                      birthdate,
                      encryptedMail,
                    ],
                  ],
                ],
                (err, rows) => {
                  if (err) {
                    return res.status(500).json({
                      err:true,
                      message: err.sqlMessage,
                    });
                  }

                  return res.status(200).json({
                
                    err:false,
                    rows:rows,
                    message:'User registred ! Please check your email (principal or spam) in order to verify your account '
                })
                }
              );
            })
            .catch((err) => {
              res.status(500).json({
                err: true,
                result: err,
              });
            });
        });
      }
    } else
      return res.status(500).json({
        err: true,
        message: 'Operation not performed! Try again later',
      });
  });
};

exports.reset=(req,res)=>{
  res.send("reset")
}
exports.googlesignin=(req,res)=>{
  res.send("google_signin")
}