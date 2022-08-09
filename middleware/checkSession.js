module.exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect(`http://${process.env.CORS_ORIGIN}/signin`);
};

module.exports.checkLoginAndRegister = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect(`http://${process.env.CORS_ORIGIN}/app/dashboard`);
  }
  return next();
};
