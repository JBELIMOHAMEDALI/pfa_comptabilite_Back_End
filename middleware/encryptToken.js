const { encrypt, decrypt } = require("jwt-transform");

module.exports.encrypt = (accessToken) => {
  return encrypt(accessToken, 10);
};
module.exports.decrypt = (tokenTodecrypt) => {
  return decrypt(tokenTodecrypt, 10);
};
