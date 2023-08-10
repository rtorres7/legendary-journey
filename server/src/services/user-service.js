const { models } = require("../data/sequelize");

class UserService {

  async fetchUser(options) {
    const user = await models.User.findOne({
      where: options,
      attributes: { exclude: ['organizationId'] },
      include: [{
        model: models.Organization,
        attributes: ['name']
      }],
    });

    if (user && user.Organization) {
      // Modify the user object to include organization name as a string
      user.setDataValue("organization", user.Organization.name);
      delete user.dataValues.Organization; // unnecessary field, for now
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
}

module.exports = UserService;
