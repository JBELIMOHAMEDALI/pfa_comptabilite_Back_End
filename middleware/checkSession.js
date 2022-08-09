module.exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
};

module.exports.checkLoginAndRegister = (req, res, next) => {
  return next();
};
