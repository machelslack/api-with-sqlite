const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../../app");

const html = fs.readFileSync(
  path.resolve(__dirname, "../../public/index.html"),
  "utf8"
);
describe("Homepage Route", () => {
  it("should return 200 status code ", async () => {
    const res = await request(app).get("/");
    expect(res.header["content-type"]).toBe("text/html; charset=UTF-8");
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(html);
  });
});
