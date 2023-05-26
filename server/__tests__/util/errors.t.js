const { handleMongooseError } = require('../../src/util/errors');

describe('Errors', () => {
  describe('handleMongooseError', () => {
    let warn;

    beforeEach(() => {
      warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      warn.mockReset();
    });

    it('should log the error and given message at warn level when exists', () => {
      handleMongooseError('It was an error', 'What happened?');

      expect(warn).toBeCalledWith('It was an error', 'What happened?');
    });

    it('should not log anything when no error', () => {
      handleMongooseError('No error', null);

      expect(warn).not.toHaveBeenCalled();
    })
  })
})
