const bcrypt = require("bcrypt");
const dbClient = require("../config/db_config");
const mailer = require("../functions/mailer");
const { encryptData, encryptToken } = require("../functions/encryption");
const query = require("../functions/db_query");
const jwt = require("jsonwebtoken");

exports.validate = (req, res) => {
  const crypted_user = req.params.hasheduser;
  try {
    let sql =
      "select * from user where crypted = ? and actif = ? and provider = ?";
    dbClient.query(sql, [crypted_user, "0", "MTX"], (err, rows) => {
      if (err)
        return res.status(500).json({
          err: true,
          message: "Operation not performed ! Try again later",
        });

      if (rows.length === 1) {
        const { lastname, firstname } = rows[0];
        sql = `UPDATE USER SET actif=?,crypted=? where crypted=?`;
        return query.sql_request(
          sql,
          [
            "1",
            crypted_user +
              "." +
              encryptData(lastname) +
              "." +
              encryptData(firstname),
            crypted_user,
          ],
          res
        );
      } else
        return res.status(404).json({
          err: true,
          message: "Account activation failed !",
        });
    });
  } catch (error) {
    return res.status(500).json({
      err: true,
      message: error.message,
    });
  }
};

// exports.signin = (req, res) => {
//   const { email, password } = req.body;
//   let sql = ` SELECT DISTINCT user.* from user where USER.email=? AND USER.actif=?and provider=? `;

//   dbClient.query(sql, [email, "1", "MTX"], (err, rows) => {
//     if (err) {
//       return res.status(500).json({
//         err: true,
//         message: "An error occured in server !  ",
//       });
//     }
//     if (rows.length == 1) {
//       bcrypt.compare(password, rows[0].password, (err, same) => {
//         if (err) {
//           return res.status(500).json({
//             err: true,
//             message: "An error occured in server !  ",
//           });
//         }
//         if (same) {
//           const user = rows[0]; //user without company test
//           const { id_user, crypted } = rows[0];
//           sql = `
//                 SELECT user.*, COUNT(id_company) as nb_companies
//                 FROM COMPANY JOIN user
//                 ON company.id_user=user.id_user
//                 where user.id_user=?
//               `;
//           dbClient.query(sql, [id_user], (err, rows) => {
//             if (!err) {
//               const { nb_companies } = rows[0];
//               const payload = {
//                 user:
//                   nb_companies === 0
//                     ? { user, nb_companies }
//                     : { user: rows[0] },
//                 // id_user,
//                 // crypted,
//                 // nb_companies,
//                 // companies: nb_companies > 0 ? rows : [],
//               };
//               const accessToken = jwt.sign(
//                 {
//                   userData: payload,
//                 },
//                 process.env.ACCESS_TOKEN_SECRET,
//                 { expiresIn: process.env.EXPIRES_IN }
//               );
//               const encryptedToken=encryptToken.encrypt(accessToken)

//               return res.status(200).json({
//                 err: false,
//                 message: "Auth successfull !",
//                 accessToken:encryptedToken
//               });
//             } else {
//               return res.status(500).json({
//                 err: true,
//                 message: "An error occured in server !",
//               });
//             }
//           });
//         } else {
//           return res.status(404).json({
//             err: true,
//             message: "Auth failed ! Check email AND/OR password ",
//           });
//         }
//       });
//     } else {
//       return res.status(404).json({
//         err: true,
//         message: "Auth failed ! Check email AND/OR password ",
//       });
//     }
//   });
// };

exports.signup = (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  let sql = "select * from user where email = ?";
  dbClient.query(sql, [email], (err, rows) => {
    if (!err) {
      if (rows.length > 0) {
        return res.status(409).json({
          //conflict
          err: true,
          message: "An account has been already associated to this email ! ",
        });
      } else {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({
              err,
              message: "error in hashing password ! Retry later",
            });
          }
          const encryptedMail = encryptData(email);
          const mailPayload = {
            receivers: email,
            subject: "ACOUNT VERIFICATION",
            text: `Hi ${
              lastname + " " + firstname
            } , Please activate your account via this url 
                ${process.env.CORS_ORIGIN}/account/${encryptedMail}`,
          };
          mailer(mailPayload)
            .then((result) => {
              dbClient.query(
                "INSERT INTO user(lastname,firstname,photo,email,password,crypted) VALUES ?",
                [
                  [
                    [
                      lastname.charAt(0).toUpperCase() + lastname.slice(1),
                      firstname.charAt(0).toUpperCase() + firstname.slice(1),
                      `https://ui-avatars.com/api/?name=${firstname
                        .charAt(0)
                        .toUpperCase()}`,
                      email,
                      hashedPassword,
                      encryptedMail,
                    ],
                  ],
                ],
                (err, rows) => {
                  if (err) {
                    return res.status(500).json({
                      err: true,
                      message: err.sqlMessage,
                    });
                  }

                  return res.status(200).json({
                    err: false,
                    rows: rows,
                    message:
                      "User registred ! Please check your email (principal or spam) in order to verify your account ",
                  });
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
        message: "Operation not performed! Try again later",
      });
  });
};

exports.verify_reset_email = (req, res, next) => {
  const { email } = req.body;
  let sql = "select * from user where email = ? AND actif =? AND provider=?";
  dbClient.query(sql, [email, "1", "MTX"], (err, rows) => {
    if (!err) {
      switch (rows.length) {
        case 0:
          return res.status(404).json({
            err: true,
            message:
              "This email doesn't exist or maybe not actif ! Please verify ",
          });
        case 1:
          const resetCode = generateCode();
          bcrypt.hash(resetCode, 10, (err, hashedCode) => {
            if (err) {
              return res.status(500).json({
                err,
                message: "error in hashing reset code ! Retry later",
              });
            }
            const mailPayload = {
              receivers: email,
              subject: "ACCOUNT RESET PASSWORD",
              text: `Hi you can reset your password account using this code : ${resetCode}`,
            };
            mailer(mailPayload)
              .then((result) => {
                dbClient.query(
                  "UPDATE user SET reset_code=? where email=? ",
                  [hashedCode, email],
                  (err, rows) => {
                    if (err) {
                      return res.status(500).json({
                        err: true,
                        message: err.sqlMessage,
                      });
                    }

                    return res.status(200).json({
                      err: false,
                      message:
                        "Verified ! An activation code has been sent to this email address ",
                    });

                    // req.userMail = {
                    //   email
                    // };
                    // next();
                  }
                );
              })
              .catch((err) => {
                return res.status(500).json({
                  err: true,
                  result: err,
                });
              });
          });
          break;
        default:
          return res.status(500).json({
            err: true,
            message: "Operation not performed! Try again later",
          });
      }
    } else
      return res.status(500).json({
        err: true,
        message: "Operation not performed! Try again later",
      });
  });
};
exports.verify_reset_code = (req, res) => {
  const { email, code } = req.body;
  let sql =
    "select reset_code from user where email = ? and actif =? and provider =?";
  dbClient.query(sql, [email, "1", "MTX"], (err, rows) => {
    if (err) {
      return res.status(500).json({
        err: true,
        message: "An error occured in server ! Retry later ",
      });
    }
    if (rows.length == 1) {
      bcrypt.compare(code, rows[0].reset_code, (err, same) => {
        if (err) {
          return res.status(500).json({
            err: true,
            message: "An error occured in server ! Retry later ",
          });
        }
        if (same) {
          return res.status(200).json({
            err: false,
            message: "Code matches succefully ! ",
          });
        } else {
          return res.status(404).json({
            err: true,
            message: "Verify your code ! ",
          });
        }
      });
    } else {
      return res.status(404).json({
        err: true,
        message:
          "Reset failed ! Check your email address or your account activation",
      });
    }
  });
};

function generateCode() {
  return Math.random().toString().substring(2, 8);
}

exports.reset_password = (req, res) => {
  const { newPassword, email } = req.body;
  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({
        err,
        message: "An error occured in server ! Retry later ",
      });
    }

    const sql =
      "UPDATE user SET password = ?,reset_code=?  WHERE email = ? and actif = ? and provider = ?";
    return query.sql_request(
      sql,
      [hashedPassword, null, email, "1", "MTX"],
      res
    );
  });
};

exports.logout = (req, res) => {
  const { id_user } = req.decoded.user;
  const sql = `UPDATE user set refresh = ? where id_user = ?`;
  query.sql_request(sql, [null, id_user], res);
};

exports.refresh = (req, res) => {
  const { token } = req.body;
  if (token == null) return res.sendStatus(401);
  const sql = `select refresh from user where refresh = ?`;
  dbClient.query(sql, [token], (err, rows) => {
    if (err) {
      return res.status(500).json({
        err,
        message: "An error occured in server ! Retry later ",
      });
    }
    if (rows[0]) {
      const { refresh } = rows[0];
      jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign(
          { user: decoded.user },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({ accessToken: accessToken });
      });
    } else {
      return res.sendStatus(403);
    }
  });
};

//The Client ID is a public identifier of your application.
// The Client Secret is confidential and should only be used to
// authenticate your application and make requests to LinkedIn's APIs
