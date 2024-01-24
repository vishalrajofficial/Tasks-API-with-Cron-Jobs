const jwt = require("jsonwebtoken");
const config = require("../configs/globalConfig");
const { handleError, CustomError } = require("./errorHandler");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  const JWT_SECRET = config.jwtSecret;

  if (!token) {
    return handleError(new CustomError(401, "Unauthorized"), res);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return handleError(new CustomError(403, "Forbidden"), res);
    }

    req.body.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
};
