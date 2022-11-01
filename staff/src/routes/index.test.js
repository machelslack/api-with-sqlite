const request = require("supertest");
const express = require("express");
const indexRouter = require("./index");

const app = express();

app.use("/", indexRouter);
describe.skip("Homepage Route", () => {
  it("should return 200 status code ", async () => {
    const res = await request(app).get("/");
    expect(res.header["content-type"]).toBe("text/html; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual("hello world");
  });
});
