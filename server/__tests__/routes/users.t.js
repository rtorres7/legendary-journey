const { GenericContainer } = require('testcontainers');
const mongoose = require("mongoose");

const request = require('supertest');
const express = require("express");

const router = require('../../src/routes/users');
const User = require('../../src/models/user');

const app = express();
app.use(express.json());
app.use('/users', router);

describe('User Routes', () => {
  let container;

  beforeAll(async () => {
    container = await new GenericContainer('mongo')
      .withExposedPorts(27017)
      .start();
  }, 70_000);

  beforeEach(async () => {
    await mongoose.connect(`mongodb://${container.getHost()}:${container.getMappedPort(27017)}/users`, {
      useNewUrlParser: true,
    });
  })

  afterAll(async () => {
    container.stop();
  });

  afterEach(async () => {
    mongoose.connection.close();
  })

  describe('GET /users', () => {
    const user = new User({
      name: 'John Doe',
      email: 'jdoe@app.co'
    });

    beforeEach(async () => {
      await user.save();
    });

    it("should return a single user", () => {
      return request(app)
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.name).toBe(user.name);
          expect(res.body.email).toBe(user.email);
        });
    });
  })
})