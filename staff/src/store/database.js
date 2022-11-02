const sqlite3 = require("sqlite3").verbose();
let jsonData = require("./data.json");

const { dataSet } = jsonData;

const addRecord = (
  { name, salary, currency, on_contract, department, sub_department },
  database
) =>
  new Promise((resolve, reject) => {
    database.run(
      `INSERT INTO Staff VALUES (null,"${name}","${salary}","${currency}","${on_contract}","${department}","${sub_department}")`,
      function (err, rows) {
        if (err) {
          reject(err);
        }
        resolve({
          message: `Record Id ${this.lastID} has been inserted`,
          rows,
        });
      }
    );
  });

const createTables = (database) => {
  database.run(
    "CREATE TABLE IF NOT EXISTS Staff (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, currency TEXT, on_contract TEXT, department TEXT,sub_department TEXT)",
    (err) => {
      if (err) {
        throw Error(`Getting create table error ${err}`);
      }
      dataSet.forEach((record) => addRecord({ ...record }, database));
    }
  );
};

const database = new sqlite3.Database("staff.db", (err) => {
  if (err) {
    if (err) {
      throw Error(`Getting connecting to database ${err}`);
    }
  }
  createTables(database);
});

const deleteRecord = (databaseClient, staffId) =>
  new Promise((resolve, reject) => {
    databaseClient.run(
      `DELETE FROM Staff WHERE id = ${staffId}`,
      function (err, records) {
        if (err) {
          reject(err);
        }
        resolve({ message: `${this.changes} row deleted`, records });
      }
    );
  });

const getStatsByContract = (databaseClient) =>
  new Promise((resolve, reject) => {
    databaseClient.all(
      "SELECT on_contract, AVG(salary), MIN(salary), MAX(salary) FROM Staff GROUP BY on_contract",
      (err, records) => {
        if (err) {
          reject(err);
        }
        resolve({ records });
      }
    );
  });

const getStatsByDepartment = (databaseClient) =>
  new Promise((resolve, reject) => {
    databaseClient.all(
      "SELECT department, AVG(salary), MIN(salary), MAX(salary) FROM Staff GROUP BY department",
      (err, records) => {
        if (err) {
          reject(err);
        }
        resolve({ records });
      }
    );
  });

const getStatsBySubDepartment = (databaseClient) =>
  new Promise((resolve, reject) => {
    databaseClient.all(
      "SELECT department, sub_department, AVG(salary), MIN(salary), MAX(salary) FROM Staff GROUP BY sub_department",
      (err, records) => {
        if (err) {
          reject(err);
        }
        resolve({ records });
      }
    );
  });

module.exports = {
  database,
  addRecord,
  deleteRecord,
  getStatsByContract,
  getStatsByDepartment,
  getStatsBySubDepartment,
};
