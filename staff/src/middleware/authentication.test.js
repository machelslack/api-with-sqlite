const { authenticateToken } = require("./authentication");
const jwt = require("jsonwebtoken");

const jwtverifyMock = jest.fn().mockReturnedValue("a-token");

const mocks = {
  requestMock: {
    body: {
      name: "staff-name",
    },
    method: "POST",
    headers: {
      token: "mock-token",
    },
  },
  responseMock: {
    status: jest.fn(),
    set: jest.fn(),
    json: jest.fn(),
  },
  nextMock: jest.fn(),
  jwtMockCallback: (err, user) => {},
  TOKEN_SECRET: "xxx",
  username: "johndoe",
  expiry: { expiresIn: "1800s" },
};

let verifyMock = jest.spyOn(jwt, "verify");

jest.mock("jwtverifyMock", () => ({
  default: {
    verify: jest.fn(),
  },
}));

describe.skip("Authentication Middleware", () => {
  beforeAll(() => {
    process.env.TOKEN_SECRET = mocks.TOKEN_SECRET;
  });
  it("should return sucess response message", () => {
    authenticateToken(mocks.requestMock, mocks.responseMock, mocks.nextMock);
  });
});
