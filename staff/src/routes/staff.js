const express = require("express");
const { database, addRecord } = require("../store/database");

const router = express.Router();

const deleteRecord = (staffId) =>
  database.run(`DELETE FROM Staff WHERE id = ${staffId}`);

const buildReponse = ({ res, rows }) => [
  /**
   * do something
   */
];

const getSumStatsByContract = () => {
  return new Promise((resolve, reject) => {
    database.get(
      "SELECT name, on_contract, AVG(salary), MIN(salary), Max(salary) FROM Staff GROUP BY on_contract",
      (err, rows) => {
        if (err) {
          console.log("Fetching rows error " + err);
          reject(err);
        }
        resolve(rows);
      }
    );
  });
};

const getSumStatsByDepartment = () => {
  return new Promise((resolve, reject) => {
    database.get(
      "SELECT department, AVG(salary), MIN(salary), Max(salary) FROM Staff GROUP BY department",
      (err, rows) => {
        if (err) {
          console.log("Fetching rows error " + err);
          reject(err);
        }
        resolve(rows);
      }
    );
  });
};

router.get("/statistics/:facet", async function (req, res) {
  const facet = req.params.facet;

  if (facet === "on_contract") {
    await getSumStatsByContract()
      .then((rows) => {
        buildReponse({ res, rows });
      })
      .catch((err) => {
        res.status(500).send(JSON.stringify(err));
      });
  }

  if (facet === "department") {
    await getSumStatsByDepartment()
      .then((rows) => {
        buildReponse({ res, rows });
      })
      .catch((err) => {
        res.status(500).send(JSON.stringify(err));
      });
  }
});

router.get("/", async function (req, res) {
  res.set("content-type", "application/json");
  let body = req.body;

  console.log("Validating body...");

  const [valid] = validateBody(body);

  if (!valid) {
    console.error("body missing name", body);
    res.status(400);
    res.json({ error: "invalid body" });
    return;
  }

  if (req.method === "POST") {
    console.log("HERE");
    await addRecord({ ...body }, database)
      .then((rows) => {
        buildReponse({ res, rows });
      })
      .catch((err) => {
        res.status(500).send(JSON.stringify(err));
      });
  }

  if (req.method === "DELETE") {
    const { staffId } = req.params;
    await deleteRecord(staffId)
      .then((rows) => {
        buildReponse({ res, rows });
      })
      .catch((err) => {
        res.status(500).send(JSON.stringify(err));
      });
  }
});

module.exports = router;
