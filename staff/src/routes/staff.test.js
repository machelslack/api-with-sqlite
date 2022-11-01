const request = require("supertest");
const express = require("express");
const staffRouter = require("./staff");

const app = express();

app.use("/api/staff", staffRouter);
describe.skip("Staff Api Route", () => {
  it("should return 200 status code ", async () => {
    const res = await request(app).get("/");
    expect(res.header["content-type"]).toBe("text/html; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual("searching by facet");
  });
});
