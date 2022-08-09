module.exports.checkAuthenticated = (req, res, next) => {
  // console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  // req.authUser=false;
  // next()
  // return res.redirect(`${process.env.CORS_ORIGIN}/signin`);
};

module.exports.checkLoginAndRegister = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.authUser=true
    return res.redirect(`${process.env.CORS_ORIGIN}/app/dashboard`);
  }
  return next();
};
