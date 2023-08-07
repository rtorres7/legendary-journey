const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

  const Organization = sequelize.models.Organization;

  sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fullName: {
      type: DataTypes.STRING,
    },

    lastName: {
      type: DataTypes.STRING,
    },

    firstName: {
      type: DataTypes.STRING,
    },

    userName: {
      type: DataTypes.STRING,
    },

    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    hasOrg: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    phone: {
      type: DataTypes.INTEGER,
    },

    dn: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },

    name: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.fullName;
      }
    },

    organizationId: {
      type: DataTypes.BIGINT,
      references: {
        model: Organization,
        key: "id",
      },
      allowNull: false,
    },

    authorizations: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          canExportZip: this.roles.some(role => ['wire_editor', 'community_editor'].includes(role)),
          canManageRelatedProducts: this.roles.some(role => ['wire_editor', 'community_editor'].includes(role)),
          canUnpublishDocuments: this.roles.some(role => ['wire_editor', 'community_editor'].includes(role)),
          canUpdateAttachments: this.roles.some(role => ['wire_editor', 'community_editor'].includes(role)),
          canManageSelects: this.roles.some(role => ['wire_editor', 'community_editor'].includes(role)),
          canManageFeatures: this.roles.some(role => ['wire_editor', 'community_editor'].includes(role)),
          canManageWire: this.roles.some(role => ['wire_editor', 'community_editor'].includes(role)),
          canPreviewWireSubscriptionEmail: this.roles.some(role => ['wire_editor', 'community_editor'].includes(role)),
          canViewDocumentAdminTools: this.roles.some(role => ['wire_editor', 'community_editor'].includes(role)),
          canManageSpecialEditions: this.roles.includes('special_edition_manager')
        };
      }
    }
  }, {
    tableName: 'users',
    underscored: true,
  });
};
