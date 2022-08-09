const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);
const { encrypt, decrypt } = require("jwt-transform");



module.exports.encryptData = function encryptData(dataToEncrypt) {
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

  let encryptedData = cipher.update(dataToEncrypt, "utf-8", "hex");

  encryptedData += cipher.final("hex");

  return encryptedData;
};

module.exports.decrpytData = function decrpytData(encryptedData) {
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

  let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

  decryptedData += decipher.final("utf8");
  return decryptedData;
};


module.exports.encryptToken = (accessToken) => {
  return encrypt(accessToken, 10);
};
module.exports.decryptToken = (tokenTodecrypt) => {
  return decrypt(tokenTodecrypt, 10);
};
