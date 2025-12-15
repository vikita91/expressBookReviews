const jwt = require('jsonwebtoken');
const config = require('../config/config');

const createToken = (username) => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(
        { username },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      resolve(token);
    } catch (error) {
      reject(error);
    }
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = {
  createToken,
  verifyToken,
};



