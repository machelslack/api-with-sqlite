const jwt = require("jsonwebtoken");
const { buildJsonReponse } = require("../helpers");

const authenticateToken = (req, res, next) => {
  const token = req.headers.token;

  if (token == null) {
    buildJsonReponse({ error, status: 401, res });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (error) => {
    if (error) {
      buildJsonReponse({ error, status: 403, res });
      return;
    }
    next();
  });
};

module.exports = { authenticateToken };
