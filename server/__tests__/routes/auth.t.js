const request = require('supertest');
const express = require("express");

jest.mock('../../src/services/auth.js', () => {
  return {
    passport: {
      authenticate: jest.fn().mockImplementation((strategy) => {
        expect(strategy).toEqual('oauth2');
        return (req, res) => {
          res.send(200);
        };
      })
    },
    ensureAuthentication: jest.fn()
  }
});

describe('Auth Routes', () => {
  afterEach(() => {
    delete process.env.THROW_TEST_ERROR;
  });

  describe('GET /auth/profile', () => {
    it("should return user", () => {
      const app = express();
      app.use(express.json());

      const router = require('../../src/routes/auth');
      app.use((req, res, next) => {
        req.user = { id: 1 };
        next();
      });
      app.use('/auth', router);

      return request(app)
        .get('/auth/profile')
        .expect(200, 'Hello, user profile: {\n  "id": 1\n}');
    });
  });

  describe('GET /auth/login', () => {
    it('should return 200', () => {
      const app = express();
      app.use(express.json());

      const router = require('../../src/routes/auth');
      app.use('/auth', router);

      return request(app)
        .get('/auth/login')
        .expect(200, 'OK');
    });
  });

  describe('GET /auth/callback', () => {
    it('should return 200', () => {
      const app = express();
      app.use(express.json());

      const router = require('../../src/routes/auth');
      app.use('/auth', router);

      return request(app)
        .get('/auth/callback')
        .expect(200, 'OK');
    });
  });

  describe('DELETE /auth/logout', () => {
    it('should return 200', () => {
      const app = express();
      app.use(express.json());

      const router = require('../../src/routes/auth');
      app.use((req, res, next) => {
        req.logout = jest.fn().mockImplementation((cb) => {
          cb(undefined);
        })
        next();
      });
      app.use('/auth', router);

      return request(app)
        .delete('/auth/logout')
        .expect(204);
    });

    it('should return 500 with logout error if occurs', () => {
      const app = express();
      app.use(express.json());

      const router = require('../../src/routes/auth');
      app.use((req, res, next) => {
        req.logout = jest.fn().mockImplementation((cb) => {
          cb(new Error('Something went wrong'));
        })
        next();
      });
      app.use('/auth', router);

      return request(app)
        .delete('/auth/logout')
        .expect(500, {"code":500,"fieldName":"","itemId":"","message":"Something went wrong"});
    });
  });
});
