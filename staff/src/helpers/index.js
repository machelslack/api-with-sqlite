const _ = require("lodash");

const buildJsonReponse = ({ error, status = 200, res, body, message }) => {
  res.set("content-type", "application/json");
  res.status(status);
  res.json({ error, message, body });
};

module.exports = { buildJsonReponse };
