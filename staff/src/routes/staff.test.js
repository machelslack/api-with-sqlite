const request = require("supertest");
const app = require("../../app");

const {
  database,
  addRecord,
  deleteRecord,
  getStatsByContract,
  getStatsByDepartment,
  getStatsBySubDepartment,
} = require("../store/database");

jest.mock("../store/database", () => ({
  database: jest.fn().mockImplementation(() => ({})),
  addRecord: jest.fn().mockResolvedValue({}),
  deleteRecord: jest.fn().mockResolvedValue({}),
  getStatsByContract: jest.fn().mockResolvedValue({}),
  getStatsByDepartment: jest.fn().mockResolvedValue({}),
  getStatsBySubDepartment: jest.fn().mockResolvedValue({}),
}));

jest.setTimeout(30000);
describe("Staff Api Route", () => {
  it("should return 200 status code when adding new record", async () => {
    const body = {
      name: "staff-name",
      salary: "staff-salary",
      currency: "salary-currency",
      department: "staff-department",
      sub_department: "staff-sub-department",
      on_contract: "true",
    };

    await request(app).post("/api/staff").send(body);
    expect(addRecord).toBeCalledWith({ ...body }, database);
  });

  it("should return 200 status code when deleting a record", async () => {
    const staffId = "123";
    await request(app).delete(`/api/staff/${staffId}`);
    expect(deleteRecord).toBeCalledWith(database, staffId);
  });

  it("should return 200 status code when request salary summary stats by contract", async () => {
    await request(app).get(`/api/staff/statistics/on_contract`);
    expect(getStatsByContract).toBeCalledWith(database);
  });

  it("should return 200 status code when request salary summary stats by deparment", async () => {
    await request(app).get(`/api/staff/statistics/department`);
    expect(getStatsByDepartment).toBeCalledWith(database);
  });

  it("should return 200 status code when request salary summary stats by sub department", async () => {
    await request(app).get(`/api/staff/statistics/sub_department`);
    expect(getStatsBySubDepartment).toBeCalledWith(database);
  });
});
