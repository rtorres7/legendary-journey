import "jest-extended";
import config from "../../src/config/config";

describe('config', () => {
  it('should have test config object', () => {
    expect(config).toBeObject();
    expect(config.env).toEqual("test");
  });
});