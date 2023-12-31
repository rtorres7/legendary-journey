const { models } = require("../data/sequelize");

class UserService {
  async fetchUser(options) {
    const user = await models.User.findOne({
      where: options,
      attributes: { exclude: ["organizationId"] },
      include: [
        {
          model: models.Organization,
        },
      ],
    });

    if (user && user.Organization) {
      user.setDataValue("organization", user.Organization.name);
    }

    return user;
  }

  async findById(id) {
    return this.fetchUser({ id: id });
  }

  async findByDN(dn) {
    return this.fetchUser({ dn: dn });
  }

  async createUser(user) {
    return await models.User.create(user);
  }

  async updateUser(id, userData) {
    const result = await models.User.update(userData, {
      where: {
        id: id,
      },
      returning: true,
    });

    return result[1][0];
  }

  // async validateUser(dn) {
  //   const foundUser = await models.User.findOne({ where: { dn: dn } });
  //   if (!foundUser) {
  //     console.log("Not found!");
  //     res.sendStatus(404);
  //   } else {
  //     res.sendStatus(200);
  //     return foundUser;
  //   }
  // }

  async deleteUser(id) {
    await models.User.destroy({ where: { id: id } });
  }

  async createOrFindOrganization(name) {
    let organization = await models.Organization.findOne({
      where: { name: name },
    });

    if (!organization) {
      organization = models.Organization.build({ name: name });
      await organization.save();
    }
    return organization;
  }

  async createUserWithOrganization(userData, organizationName) {
    const organization = await this.createOrFindOrganization(organizationName);
    const newUser = new models.User({
      ...userData,
      organizationId: organization.id,
    });
    await newUser.save();
    return newUser;
  }

  async updateUserOrganization(userId, organizationName) {
    const organization = await this.createOrFindOrganization(organizationName);
    const user = await this.findById(userId);
    user.organizationId = organization.id;
    await user.save();
    return user;
  }
}

module.exports = UserService;
