const { MongoExtension } = require("@kiwiproject/kiwi-test-js");
const mongoose = require("mongoose");

describe("Mongoose setup", () => {
  afterEach(() => {
    mongoose.connection.close();
    jest.clearAllMocks();
  });

  it("should setup mongoose", async () => {
    process.env.MONGO_DATABASE_URL =
      MongoExtension.getMongoUriWithDb("articles");

    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    const setupMongoose = require("../../../src/data/mongoose");

    setupMongoose();

    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 200),
    );
    expect(log).toBeCalledWith("Mongo connection successful");
  });
});
