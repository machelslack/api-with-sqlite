const {
  buildJsonReponse,
  validateUserNameInBody,
  validateFormInputInBody,
} = require("./index");

const mocks = {
  response: {
    set: jest.fn(),
    status: jest.fn(),
    json: jest.fn(),
  },
};
describe("Helpers", () => {
  describe("validateUserNameInBody", () => {
    it("should return true when username is include in the request body", () => {
      const args = {
        request: {
          body: {
            name: "a-name",
            salary: "a-salary",
            currency: "a-currency",
            department: "a-department",
            sub_department: "a-sub_department",
            on_contract: "contract",
          },
        },
      };

      const result = validateFormInputInBody(args.request.body);
      expect(result[0]).toBeTruthy;
    });

    it("should return false if any of the below body properties are undefined", () => {
      const args = {
        request: {
          body: {
            name: "a-name",
            salary: "a-salary",
            currency: "a-currency",
            department: undefined,
            sub_department: "a-sub_department",
            on_contract: "contract",
          },
        },
      };

      const result = validateFormInputInBody(args.request.body);
      expect(result[0]).toBeFalsy;
    });
  });
  describe("validateUserNameInBody", () => {
    it("should return true when username is include in the request body", () => {
      const args = {
        request: {
          body: { username: "some-name" },
        },
      };

      const result = validateUserNameInBody(args.request.body);

      expect(result[0]).toBeTruthy;
    });

    it("should return false when username is include in the request body", () => {
      const args = {
        request: {
          body: {},
        },
      };

      const result = validateUserNameInBody(args.request.body);
      expect(result[0]).toBeFalsy;
    });
  });

  describe("buildJsonReponse", () => {
    it("should return 200 status code and body propertie sin the response", () => {
      const args = { body: {}, res: mocks.response };

      buildJsonReponse(args);

      expect(mocks.response.set).toBeCalledWith(
        "content-type",
        "application/json"
      );
      expect(mocks.response.status).toBeCalledWith(200);
      expect(mocks.response.json).toBeCalledWith({ body: args.body });
    });

    it("should return 200 status code with a message and body properties in the response ", () => {
      const args = {
        body: {},
        messsage: "a-message",
        res: mocks.response,
      };

      buildJsonReponse(args);

      expect(mocks.response.set).toBeCalledWith(
        "content-type",
        "application/json"
      );
      expect(mocks.response.status).toBeCalledWith(200);
      expect(mocks.response.json).toBeCalledWith({
        body: args.body,
        messsage: args.message,
      });
    });

    it("should return 500 status code in request response ", () => {
      const args = { error: "error-message", status: 500, res: mocks.response };

      buildJsonReponse(args);

      expect(mocks.response.set).toBeCalledWith(
        "content-type",
        "application/json"
      );
      expect(mocks.response.status).toBeCalledWith(500);
      expect(mocks.response.json).toBeCalledWith({ error: args.error });
    });
  });
});
