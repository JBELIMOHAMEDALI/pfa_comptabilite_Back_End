const GoogleStrategy = require("passport-google-oauth2").Strategy;
const client = require("./db_config");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5001/auth/google/callback",
        scope: ["profile"],
      },
      async (request, accessToken, refreshToken, profile, done) => {
        let sql = "select * from guser where profileId=?";
        client.query(sql, [profile.id], (err, rows) => {
          if (err) {
            return done(err,false);
          }
          if (rows.length == 1) {
            return done(null, rows[0]);
          } 
          // else {
            console.log("Creating new user...");

            const values = [
              [[profile.id, profile.given_name, profile.family_name]],
            ];
            //
            sql = "INSERT INTO guser(profileId, firstname,lastname) VALUES ?";
            client.query(sql, values, (err, rows) => {
              if (err) {
                return done(err,false);
              }
              return done(null, rows[0]);
            });
          // }
        });
      }
    )
  );
};
