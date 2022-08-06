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
        let sql = "select * from user where email=?";
        client.query(sql, [profile.email], (err, rows) => {
          if (err) return done(err);

          if (rows.length == 1 && rows[0].provider == profile.provider)
            //google user
            return done(null, rows[0]);
          else if (rows.length == 0) {
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
              return done(null, { ...profile });
            });
          } else {
            //user exists without google's provide
            return done(null, false);
          }
        });
      }
    )
  );
};
