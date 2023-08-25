const { Sequelize } = require("sequelize");
const { PostgresExtension } = require("@kiwiproject/kiwi-test-js");

describe('User model', () => {
  let postgresUri;

  beforeAll(async () => {
    await PostgresExtension.setupNewDatabase("user_model");
    postgresUri = PostgresExtension.getPostgresUriWithDb("user_model");
    process.env.POSTGRES_CONNECTION_URL = postgresUri;
  });

  afterAll(async () => {
    await PostgresExtension.dropDatabase("user_model");
  });

  describe('authorizations', () => {
    it('should contain some with true if wire_editor', async () => {
      const sequelize = new Sequelize(postgresUri);

      const userModel = require('../../src/models/user');
      userModel(sequelize);

      const user = sequelize.models.User.build({ roles: ['wire_editor'] });

      const authorizations = user.authorizations;

      expect(authorizations.canExportZip).toBeTrue();
      expect(authorizations.canManageRelatedProducts).toBeTrue();
      expect(authorizations.canUnpublishDocuments).toBeTrue();
      expect(authorizations.canUpdateAttachments).toBeTrue();
      expect(authorizations.canManageSelects).toBeTrue();
      expect(authorizations.canManageFeatures).toBeTrue();
      expect(authorizations.canManageWire).toBeTrue();
      expect(authorizations.canPreviewWireSubscriptionEmail).toBeTrue();
      expect(authorizations.canViewDocumentAdminTools).toBeTrue();
      expect(authorizations.canManageSpecialEditions).toBeFalse();
    });

    it('should contain some with true if community_editor', async () => {
      const sequelize = new Sequelize(postgresUri);

      const userModel = require('../../src/models/user');
      userModel(sequelize);

      const user = sequelize.models.User.build({ roles: ['community_editor'] });

      const authorizations = user.authorizations;

      expect(authorizations.canExportZip).toBeTrue();
      expect(authorizations.canManageRelatedProducts).toBeTrue();
      expect(authorizations.canUnpublishDocuments).toBeTrue();
      expect(authorizations.canUpdateAttachments).toBeTrue();
      expect(authorizations.canManageSelects).toBeTrue();
      expect(authorizations.canManageFeatures).toBeTrue();
      expect(authorizations.canManageWire).toBeTrue();
      expect(authorizations.canPreviewWireSubscriptionEmail).toBeTrue();
      expect(authorizations.canViewDocumentAdminTools).toBeTrue();
      expect(authorizations.canManageSpecialEditions).toBeFalse();
    });

    it('should contain one with true if special_edition_manager', async () => {
      const sequelize = new Sequelize(postgresUri);

      const userModel = require('../../src/models/user');
      userModel(sequelize);

      const user = sequelize.models.User.build({ roles: ['special_edition_manager'] });

      const authorizations = user.authorizations;

      expect(authorizations.canExportZip).toBeFalse();
      expect(authorizations.canManageRelatedProducts).toBeFalse();
      expect(authorizations.canUnpublishDocuments).toBeFalse();
      expect(authorizations.canUpdateAttachments).toBeFalse();
      expect(authorizations.canManageSelects).toBeFalse();
      expect(authorizations.canManageFeatures).toBeFalse();
      expect(authorizations.canManageWire).toBeFalse();
      expect(authorizations.canPreviewWireSubscriptionEmail).toBeFalse();
      expect(authorizations.canViewDocumentAdminTools).toBeFalse();
      expect(authorizations.canManageSpecialEditions).toBeTrue();
    });
  });
});
