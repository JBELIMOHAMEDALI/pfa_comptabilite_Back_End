const GoogleStrategy = require("passport-google-oauth2").Strategy;
const client = require("./db_config");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        let sql = `select user.*,COUNT(id_company) AS nb_companies from user 
        join company ON company.id_user=user.id_user where profileId=?`;
        client.query(sql, [profile.id], (err, rows) => {
          if (err) return done(err);

          if (rows.length == 1) {
            const { nb_companies } = rows[0];
            if (nb_companies == 0) {
              return done(null, { ...profile,nb_companies });
            } else {
              return done(null, rows[0]);
            }
            //google user
          } else if (rows.length == 0) {
            //google user doesnt exist
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
              if (err) return done(err);
              return done(null, { ...profile,nb_companies:0 });
            });
          }
          // else {
          //user exists without google's provide
          // return done(null, false);
          // }
        });
      }
    )
  );
};

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
