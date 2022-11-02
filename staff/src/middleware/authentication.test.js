const { authenticateToken } = require("./authentication");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn().mockReturnValue("a-token"),
}));

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
  TOKEN_SECRET: "xxx",
};

describe("Authentication Middleware", () => {
  beforeAll(() => {
    process.env.TOKEN_SECRET = mocks.TOKEN_SECRET;
  });
  it("should authenticate user sucess response message", () => {
    authenticateToken(mocks.requestMock, mocks.responseMock, mocks.nextMock);
    expect(jwt.verify).toBeCalledWith(
      mocks.requestMock.headers.token,
      mocks.TOKEN_SECRET,
      expect.anything()
    );
  });
});
