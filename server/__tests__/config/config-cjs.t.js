const { config } = require("../../src/config/config");

describe('config', () => {
  it('should have test config object', () => {
    expect(config).toBeObject();
    expect(config.env).toEqual("test");
  });
});