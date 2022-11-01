const express = require("express");
const { database, addRecord } = require("../store/database");
const {
  getSummaryStatBySubDepartments,
  buildJsonReponse,
} = require("../helpers");

const router = express.Router();

const validateBody = (body) => {
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

const deleteRecord = (staffId) =>
  new Promise((resolve, reject) => {
    database.run(
      `DELETE FROM Staff WHERE id = ${staffId}`,
      function (err, rows) {
        if (err) {
          reject(err);
        }
        resolve({ message: `${this.changes} row deleted`, rows });
      }
    );
  });

const getSumStatsByContract = () => {
  return new Promise((resolve, reject) => {
    database.all(
      "SELECT on_contract, AVG(salary), MIN(salary), MAX(salary) FROM Staff GROUP BY on_contract",
      (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve({ rows });
      }
    );
  });
};

const getSumStatsByDepartment = () => {
  return new Promise((resolve, reject) => {
    database.all(
      "SELECT department, AVG(salary), MIN(salary), MAX(salary) FROM Staff GROUP BY department",
      (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve({ rows });
      }
    );
  });
};

const getSummaryAllSalaries = () => {
  return new Promise((resolve, reject) => {
    database.all("SELECT * FROM Staff", (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve({ rows });
    });
  });
};

router.get("/statistics/:facet", async function (req, res) {
  const facet = req.params.facet;
  if (facet === "on_contract") {
    await getSumStatsByContract()
      .then(({ message, rows }) => {
        buildJsonReponse({ res, body: rows, message });
      })
      .catch((err) => {
        buildJsonReponse({
          error: `Internal Server Error - ${err}`,
          status: 500,
          res,
        });
      });
  }

  if (facet === "department") {
    await getSumStatsByDepartment()
      .then(({ message, rows }) => {
        buildJsonReponse({ res, body: rows, message });
      })
      .catch((err) => {
        buildJsonReponse({
          error: `Internal Server Error - ${err}`,
          status: 500,
          res,
        });
      });
  }

  if (facet === "sub_department") {
    await getSummaryAllSalaries()
      .then(({ message, rows }) => {
        buildJsonReponse({
          res,
          body: getSummaryStatBySubDepartments(rows),
          message,
        });
      })
      .catch((err) => {
        buildJsonReponse({
          error: `Internal Server Error - ${err}`,
          status: 500,
          res,
        });
      });
  }
});

router.post("/", async function (req, res) {
  let body = req.body;

  const [valid] = validateBody(body);

  console.log("Validating body...");

  if (!valid) {
    buildJsonReponse({ error: "Bad Request", status: 400, res });
    return;
  }

  await addRecord({ ...body }, database)
    .then(({ message, rows }) => {
      buildJsonReponse({ res, body: rows, message });
    })
    .catch((err) => {
      buildJsonReponse({
        error: `Internal Server Error - ${err}`,
        status: 500,
        res,
      });
    });
});

router.delete("/:staffId", async function (req, res) {
  const { staffId } = req.params;

  if (!staffId) {
    buildJsonReponse({ error: `Bad Request`, status: 400, res });
    return;
  }

  if (req.method === "DELETE") {
    await deleteRecord(staffId)
      .then(({ message, rows }) => {
        buildJsonReponse({ res, body: rows, message });
      })
      .catch((err) => {
        buildJsonReponse({
          error: `Internal Server Error - ${err}`,
          status: 500,
          res,
        });
      });
  }
});

module.exports = router;
