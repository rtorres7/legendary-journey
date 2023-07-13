const request = require('supertest');
const express = require("express");
const router = require('../../src/routes/alerts');

const app = express();
app.use(express.json());
app.use(router);

describe('Alert Routes', () => {
  describe('GET /alerts/list', () => {
    it("should return an empty JSON array", () => {
      return request(app)
        .get('/alerts/list')
        .expect('Content-Type', /json/)
        .expect(200, []);
    });
  });
});
