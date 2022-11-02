const _ = require("lodash");

const buildJsonReponse = ({ error, status = 200, res, body, message }) => {
  res.set("content-type", "application/json");
  res.status(status);
  res.json({ error, message, body });
};

const validateUserNameInBody = (body) => {
  if (!("username" in body)) {
    return [false];
  }

  return [true];
};

const validateFormInputInBody = (body) => {
  if (!("name" in body)) {
    return [false];
  }

  if (!("salary" in body)) {
    return [false];
  }

  if (!("currency" in body)) {
    return [false];
  }

  if (!("on_contract" in body)) {
    return [false];
  }

  if (!("department" in body)) {
    return [false];
  }

  if (!("sub_department" in body)) {
    return [false];
  }

  return [true];
};

module.exports = {
  buildJsonReponse,
  validateUserNameInBody,
  validateFormInputInBody,
};
