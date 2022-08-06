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

        let sql = "select * from user where profileId=? and provider =?";
        client.query(sql, [profile.id,profile.provider], (err, rows) => {
          if (err) return done(err);

          if (rows.length == 1) return done(null, rows[0]);

          const values = [
            [[profile.id, profile.given_name, profile.family_name,profile.email,"1",profile.provider]],
          ];
          sql = "INSERT INTO user(profileId, firstname,lastname,email,actif,provider) VALUES ?";
          client.query(sql, values, (err, rows) => {
            if (err) return done(err);
            return done(null, { ...profile });
          });
        });
      }
    )
  );
};
