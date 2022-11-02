const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const usersRouter = require("./users");

const mockJwtSign = jest.fn().mockReturnedValue("a-token");

jest.mock("jsonwebtoken", () => ({
  default: {
    sign: mockJwtSign,
  },
}));

const app = express();

app.use("/user", usersRouter);

let data = {};
let mocks = {
  TOKEN_SECRET: "xxx",
  username: "johndoe",
  expiry: { expiresIn: "1800s" },
};
process.env.TOKEN_SECRET = mocks.TOKEN_SECRET;

describe.skip("User Api Route", () => {
  describe.skip("Post Route", () => {
    let res;
    beforeAll(async () => {
      res = await request(app).post("/api/users").send({
        username: "johndoe",
      });
    });
    it("should create a new login user", () => {
      expect(res.header["content-type"]).toBe(
        "  application/json; charset=utf-8"
      );
      expect(res.body).toHaveProperty("post");
      expect(res.status).toEqual(201);
    });

    it("should generate an access token and return to the user", () => {
      expect(jwtSignMock).tobeCalledWith(
        mocks.username,
        mocks.TOKEN_SECRET,
        mocks.expiry
      );
      expect(res.json).toEqual(mocks.TOKEN_SECRET);
    });
  });
});
