import { expect, jest } from '@jest/globals';
import { handleMongooseError } from '../../src/util/errors';

describe('Errors', () => {
  const { logger } = require('../../src/config/logger');

  describe('handleMongooseError', () => {
    let warn;
    beforeEach(() => {
      expect(logger).not.toBeUndefined();
      warn = jest.spyOn(logger, 'info').mockImplementation(() => {});
    });

    afterEach(() => {
      warn.mockReset();
    });

    it('should log the error and given message at warn level when exists', () => {
      handleMongooseError('It was an error', 'What happened?');

      expect(logger.info).toBeCalledWith('It was an error', 'What happened?');
    });

    it('should not log anything when no error', () => {
      handleMongooseError('No error', null);

      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
