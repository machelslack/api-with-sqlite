const express = require("express");
const { database, addRecord } = require("../store/database");
const { buildJsonReponse } = require("../helpers");

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
      function (err, records) {
        if (err) {
          reject(err);
        }
        resolve({ message: `${this.changes} row deleted`, records });
      }
    );
  });

const getSumStatsByContract = () => {
  return new Promise((resolve, reject) => {
    database.all(
      "SELECT on_contract, AVG(salary), MIN(salary), MAX(salary) FROM Staff GROUP BY on_contract",
      (err, records) => {
        if (err) {
          reject(err);
        }
        resolve({ records });
      }
    );
  });
};

const getSumStatsByDepartment = () => {
  return new Promise((resolve, reject) => {
    database.all(
      "SELECT department, AVG(salary), MIN(salary), MAX(salary) FROM Staff GROUP BY department",
      (err, records) => {
        if (err) {
          reject(err);
        }
        resolve({ records });
      }
    );
  });
};

const getSumStatsBySubDepartment = () => {
  return new Promise((resolve, reject) => {
    database.all(
      "SELECT department, sub_department, AVG(salary), MIN(salary), MAX(salary) FROM Staff GROUP BY sub_department",
      (err, records) => {
        if (err) {
          reject(err);
        }
        resolve({
          records: records.map((row) => {
            const {
              department = `${department}`,
              sub_department,
              ...rest
            } = row;
            return {
              department: department,
              sub_department: {
                name: sub_department,
                ...rest,
              },
            };
          }),
        });
      }
    );
  });
};

router.get("/statistics/:facet", async function (req, res) {
  const facet = req.params.facet;
  if (facet === "on_contract") {
    await getSumStatsByContract()
      .then(({ records }) => {
        buildJsonReponse({ res, body: records });
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
      .then(({ records }) => {
        buildJsonReponse({ res, body: records });
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
    await getSumStatsBySubDepartment()
      .then(({ records }) => {
        buildJsonReponse({
          res,
          body: records,
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
    .then(({ message, records }) => {
      buildJsonReponse({ res, body: records, message });
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
      .then(({ message, records }) => {
        buildJsonReponse({ res, body: records, message });
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
