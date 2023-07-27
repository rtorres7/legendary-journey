// jest.config.ts
// "globalTeardown": "<rootDir>/__tests__/__utils__/testTeardown.js",
// DO NOT use except for testing
// ignores any open handles and kill the jest process masking the errors
export default () => {
  process.exit(0);
};