const GoogleStrategy = require("passport-google-oauth2").Strategy;
const client = require("./db_config");
const LocalStrategy = require("passport-local").Strategy;
const {encryptToken} = require('../functions/encryption');


module.exports.initGooglePassportConfig = (passport, getUserById) => {
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
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        let sql = `select user.* from user where email=?`;
        client.query(sql, [profile.email], (err, rows) => {
          if (err) return done(err);
          if (rows.length == 1) {
            if (rows[0].provider === "google") {
              return done(null, rows[0]);
            } else {
              return done(null, false);
            }
            // if()
            // const { nb_companies } = rows[0];
            // if (nb_companies == 0) {
            //   return done(null, { ...profile, nb_companies });
            // } else {
          } else {
            //create google user
            const values = [
              [
                [
                  profile.id,
                  profile.given_name.charAt(0).toUpperCase() +
                    profile.given_name.slice(1),
                  profile.family_name.charAt(0).toUpperCase() +
                    profile.family_name.slice(1),

                  profile.email,
                  "1",
                  profile.provider,
                ],
              ],
            ];
            sql =
              "INSERT INTO user(profileId, firstname,lastname,email,actif,provider) VALUES ?";
            client.query(sql, values, (err, rows) => {
              if (err) return done(err, null);
              return done(null, { ...profile, nb_companies: 0 });
            });
          }
        });
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((uid, done) => done(null, getUserById(uid)));
};

module.exports.initLocalPassportConfig = (
  passport,
  getUserByEmailAndPwd,
  getUserById
) => {
  const authenticateUser = (email, password, done) => {
    const user = getUserByEmailAndPwd(email, password);
    if (user == null) {
      return done(null, false, "No user with that email AND/OR password ! "); //(server error,userfound or not,message)
    }
    const { nb_companies } = user;
    const payload = {
      user: { ...user, nb_companies } 
    };
    const accessToken = jwt.sign(
      {
        userData: payload,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: process.env.EXPIRES_IN }
    );
    const encryptedToken = encryptToken(accessToken);

    const render= {
      err: false,
      message: "Auth successfull !",
      accessToken: encryptedToken,
    };
    return done(null, render);
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((uid, done) => done(null, getUserById(uid)));
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
