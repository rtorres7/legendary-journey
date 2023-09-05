const { loadUsers } = require("../__utils__/dataLoader");
const { Sequelize } = require("sequelize");
const { PostgresExtension } = require("@kiwiproject/kiwi-test-js");

describe("User Service", () => {
  let service;
  let organization;
  let postgresUri;

  let sequelize;
  let User;
  let Organization;

  beforeAll(async () => {
    await PostgresExtension.setupNewDatabase("users");
    postgresUri = PostgresExtension.getPostgresUriWithDb("users");
    process.env.POSTGRES_CONNECTION_URL = postgresUri;

    const loadedData = await loadUsers(postgresUri);
    sequelize = loadedData.sequelize;
    User = loadedData.User;
    Organization = loadedData.Organization;

    const organizationModel = require("../../src/models/organization");
    organizationModel(sequelize);
    organization = await sequelize.models.Organization.findOne({
      where: { name: "DNI" },
    });
  });

  beforeEach(() => {
    const UserService = require("../../src/services/user-service");
    service = new UserService();
  });

  afterAll(async () => {
    await PostgresExtension.dropDatabase("users");
  });

  describe("findById", () => {
    it("should return the user with the given id", async () => {
      const originalUser = await User.findOne({
        where: { email: "foo@example.com" },
        attributes: { exclude: ["organizationId"] },
        include: [Organization],
      });

      if (originalUser && originalUser.Organization) {
        originalUser.setDataValue(
          "organization",
          originalUser.Organization.name,
        );
      }

      const user = await service.findById(originalUser.id);

      expect(user.get()).toEqual(originalUser.get());
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
        cn: "bar",
        organizationId: organization.id,
      });

      expect(savedUser.id).toBeDefined();
    });
  });

  describe("updateUser", () => {
    it("should update the given user with the given data", async () => {
      const sequelize = new Sequelize(postgresUri);

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
        cn: "delete-me",
        organizationId: organization.id,
      });

      await service.deleteUser(user.id);

      const expected = await models.User.findOne({ where: { id: user.id } });
      expect(expected).toBeNull();
    });
  });

  describe("createOrFindOrganization", () => {
    it("should create or find an organization by name", async () => {
      const orgName = "NewOrg";
      const organization = await service.createOrFindOrganization(orgName);
      expect(organization.name).toEqual(orgName);
    });
  });

  describe("createUserWithOrganization", () => {
    it("should create a user and associate it with an organization", async () => {
      const userData = {
        email: "newuser@example.com",
        dn: "O=NewOrg,CN=newuser",
        cn: "newuser",
      };
      const organizationName = "NewOrg";
      const newUser = await service.createUserWithOrganization(
        userData,
        organizationName,
      );

      expect(newUser.id).toBeDefined();
      expect(newUser.organizationId).toBeDefined();
    });
  });

  describe("updateUserOrganization", () => {
    it("should update the organization of an existing user", async () => {
      const originalUser = await User.findOne({
        where: { email: "foo@example.com" },
      });
      const newOrganizationName = "UpdatedOrg";

      const updatedUser = await service.updateUserOrganization(
        originalUser.id,
        newOrganizationName,
      );

      expect(updatedUser.organizationId).toBeDefined();
      expect(updatedUser.organizationId).not.toEqual(
        originalUser.organizationId,
      );
    });
  });
});
