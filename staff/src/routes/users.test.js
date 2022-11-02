const request = require("supertest");
const app = require("../../app");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("a-token"),
}));

describe("User Api Route", () => {
  describe("Post Route", () => {
    it("should create a new login token", async () => {
      const res = await request(app).post("/api/users").send({
        username: "johndoe",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ body: { token: "a-token" } });
    });
  });
});
