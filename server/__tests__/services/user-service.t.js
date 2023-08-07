const { PostgreSqlContainer } = require("testcontainers");
const { loadUsers } = require("../__utils__/dataLoader");
const { Sequelize } = require("sequelize");

describe("User Service", () => {
  let postgresContainer;
  let service;
  let organization;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
    process.env.POSTGRES_CONNECTION_URL = postgresContainer.getConnectionUri();

    await loadUsers(postgresContainer.getConnectionUri());

    const sequelize = new Sequelize(postgresContainer.getConnectionUri());
    const organizationModel = require("../../src/models/organization");
    organizationModel(sequelize);
    organization = await sequelize.models.Organization.findOne({
      where: { name: "DNI" },
    });
  }, 120_000);

  beforeEach(() => {
    const UserService = require("../../src/services/user-service");
    service = new UserService();
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 300_000)); // wait 5 minutes for the container to stop
    postgresContainer.stop();
  });

  describe("findById", () => {
    it("should return the user with the given id", async () => {
      const sequelize = new Sequelize(postgresContainer.getConnectionUri());

      const userModel = require("../../src/models/user");
      userModel(sequelize);

      const originalUser = await sequelize.models.User.findOne({
        where: { email: "foo@example.com" },
      });
      const user = await service.findById(originalUser.id);

      expect(user).toEqual(originalUser);
    });
  });

  describe("findByDN", () => {
    it("should return the user with the given dn", async () => {
      const user = await service.findByDN("O=US,OU=OFFICE,CN=foo");

      expect(user.email).toEqual("foo@example.com");
    });
  });

  describe("createUser", () => {
    it("should create a user with the given information", async () => {
      const savedUser = await service.createUser({
        email: "bar@example.com",
        dn: "O=US,CN=bar",
        organizationId: organization.id,
      });

      expect(savedUser.id).toBeDefined();
    });
  });

  describe("updateUser", () => {
    it("should update the given user with the given data", async () => {
      const sequelize = new Sequelize(postgresContainer.getConnectionUri());

      const userModel = require("../../src/models/user");
      userModel(sequelize);

      const originalUser = await sequelize.models.User.findOne({
        where: { email: "foo@example.com" },
      });

      const updatedUser = await service.updateUser(originalUser.id, {
        firstName: "Bob",
      });

      expect(updatedUser.firstName).toEqual("Bob");
      expect(updatedUser.id).toEqual(originalUser.id);
      expect(updatedUser.updatedAt).not.toEqual(originalUser.updatedAt);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const { models } = require("../../src/data/sequelize");
      const user = await models.User.create({
        email: "to-be-deleted",
        dn: "delete-me",
        organizationId: organization.id,
      });

      await service.deleteUser(user.id);

      const expected = await models.User.findOne({ where: { id: user.id } });
      expect(expected).toBeNull();
    });
  });
});
