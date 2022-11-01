const _ = require("lodash");

const buildJsonReponse = ({ error, status = 200, res, body, message }) => {
  res.set("content-type", "application/json");
  res.status(status);

  if (error) {
    res.json({ error: error, message });
  } else {
    res.json({ message, body });
  }
};

const getStats = (salaries) => ({
  "AVG(salary)": _.mean(salaries),
  "MIN(salary)": _.min(salaries),
  "MAX(salary)": _.max(salaries),
});

const getSummaryStatBySubDepartments = (records) => {
  let salaries;
  return records.reduce((departments, record) => {
    if (record.department in departments) {
      if (
        record.sub_department in departments[record.department].sub_department
      ) {
        const subRecords = departments[record.department].sub_department;
        const subRecord = subRecords[record.sub_department];
        salaries = [...subRecord.salaries, Number(record.salary)];
        departments[record.department].sub_department = {
          ...subRecords,
          [record.sub_department]: {
            ...subRecord,
            salaries,
            stats: getStats(salaries),
          },
        };
        return departments;
      }
      salaries = [Number(record.salary)];
      departments[record.department] = {
        sub_department: {
          [record.sub_department]: {
            salaries,
            name: record.sub_department,
            stats: getStats(salaries),
          },
        },
      };
      return departments;
    }
    salaries = [Number(record.salary)];
    return {
      ...departments,
      [record.department]: {
        name: record.department,
        sub_department: {
          [record.sub_department]: {
            salaries,
            name: record.sub_department,
            stats: getStats(salaries),
          },
        },
      },
    };
  }, {});
};

module.exports = { buildJsonReponse, getSummaryStatBySubDepartments };
