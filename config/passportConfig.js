const GoogleStrategy = require("passport-google-oauth2").Strategy;
const client = require("./db_config");
const LocalStrategy = require("passport-local").Strategy;
const { encryptToken } = require("../functions/encryption");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.initGooglePassportConfig = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/user/google/callback",
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
        // passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        let sql = `select user.id_user,user.photo,user.profileId,user.firstname,user.lastname,user.email,user.provider
         from user where email=?`;
        client.query(sql, [profile.email], (err, rows) => {
          if (err) return done(err);
          if (rows.length == 1) {
            if (rows[0].provider === "google") {
              return done(null, rows[0]);
            } else {
              return done(null, false);
            }
          } else {
            //create google user
            const values = [
              [
                [
                  profile.id,
                  profile.family_name.charAt(0).toUpperCase() +
                    profile.family_name.slice(1),
                  profile.given_name.charAt(0).toUpperCase() +
                    profile.given_name.slice(1),
                  `https://ui-avatars.com/api/?name=${profile.given_name
                    .charAt(0)
                    .toUpperCase()}`,
                  profile.email,
                  "1",
                  profile.provider,
                ],
              ],
            ];
            sql =
              "INSERT INTO user(profileId, lastname,firstname,photo,email,actif,provider) VALUES ?";
            client.query(sql, values, (err, rows) => {
              if (err) return done(err, null);
              return done(null, {
                ...profile,
                nb_companies: 0,
                id_user: rows.insertId,
              });
            });
          }
        });
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id_user));
  passport.deserializeUser((id_user, done) => {
    const sql = `select id_user from user where user.id_user=?`;
    client.query(sql, [id_user], (err, rows) => {
      if (err) return done(err, false);
      done(null, rows[0].id_user);
    });
    // done(null, getUserById(user.id_user));
  });
};

module.exports.initLocalPassportConfig = (passport) => {
  const authenticateUser = (email, password, done) => {
    let sql = ` SELECT user.id_user,user.password from user where USER.email=? AND USER.actif=?and provider=? `;

    client.query(sql, [email, "1", "ATA"], (err, rows) => {
      if (err) {
        return done(null, {
          status: 500,
          err: true,
          message: "Server error ",
          uid: -1,
        });
      }
      if (rows.length == 1) {
        bcrypt.compare(password, rows[0].password, (err, same) => {
          if (same) {
            const { id_user } = rows[0];
            sql = `    
                  SELECT user.id_user,user.lastname,user.firstname,user.email,user.photo,COUNT(id_company) as nb_companies
                  FROM COMPANY JOIN user 
                  ON company.id_user=user.id_user                  
                  where user.id_user=?
                `;
            client.query(sql, [id_user], (err, rows) => {
              const user = rows[0];
              if (err)
                return done(null, {
                  status: 500,
                  err: true,
                  message: "Server error ",
                  uid: -1,
                });
              if (user == null) {
                return done(null, {
                  status: 404,
                  err: true,
                  message: "Auth failed ! Check email AND/OR password ",
                  uid: -1,
                }); //(server error,userfound or not,message)
              }
              const { nb_companies } = user;
              const accessToken = jwt.sign(
                {
                  user: {
                    ...user,
                    nb_companies,
                  },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.EXPIRES_IN }
              );

              const render = {
                status: 200,
                err: false,
                message: "Auth successfull !",
                accessToken,
                uid: user.id_user,
              };
              return done(null, render);
            });
          } else {
            return done(
              null,
              {
                status: 404,
                err: true,
                message: "Auth failed ! Check email AND/OR password ",
                uid: -1,
              },
              "Server error ! "
            ); //(server error,userfound or not,message)
          }
        });
      } else {
        return done(null, {
          status: 404,
          err: true,
          message: "Auth failed ! Check email AND/OR password ",
          uid: -1,
        }); //(server error,userfound or not,message)
      }
    });
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user.uid));
  passport.deserializeUser((user, done) => {
    // done(null, getUserById(render.uid));
    const sql = `select * from user where user.id_user=?`;
    client.query(sql, [user.id_user], (err, rows) => {
      if (err) return done(err, false);
      done(null, rows[0].id_user);
    });
  });
};

//done first parameter is the err
//done 2nd parameter is the user we found(true or false)
//we can add 3rd parameter for a message tha will be diplayed
// const JwtStrategy = require("passport-jwt").Strategy;
// const { ExtractJwt } = require("passport-jwt");
// module.exports = (passport) => {
//   passport.use(new GoogleStrategy({}));
//   passport.use(
//     new JwtStrategy(
//       {
//         jwtFromRequest: ExtractJwt.fromHeader("authorization"),
//         secretOrKey: "secretKey",
//       },
//       async (jwtPayload, done) => {
//         try {
//           const user = jwtPayload.user;
//           done(null, user);
//         } catch (error) {
//           done(error, false);
//         }
//       }
//     )
//   );
// };
