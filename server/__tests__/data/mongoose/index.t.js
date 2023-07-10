const { GenericContainer } = require("testcontainers");
const mongoose = require('mongoose');

describe('Mongoose setup', () => {
  let container;

  beforeAll(async () => {
    container = await new GenericContainer('mongo')
      .withExposedPorts(27017)
      .start();
  }, 120_000);

  afterAll(async () => {
    await container.stop();
  });

  afterEach(() => {
    mongoose.connection.close();
    jest.clearAllMocks();
  });

  it('should setup mongoose', async () => {
    process.env.MONGO_DATABASE_URL = `${container.getHost()}:${container.getMappedPort(27017)}`;

    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    const setupMongoose = require('../../../src/data/mongoose');

    setupMongoose();

    await new Promise(res => setTimeout(() => {
      res();
    }, 100));
    expect(log).toBeCalledWith('Mongo connection successful');
  });
});
