const request = require('supertest');
const express = require("express");
const router = require('../../src/routes/alerts');

const app = express();
app.use(express.json());
app.use('/alerts', router);

describe('Alert Routes', () => {
  describe('GET /alerts/list', () => {
    it("should return an empty JSON array", async () => {
      const res = await request(app).get('/alerts/list');
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  })
})
