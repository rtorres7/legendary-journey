const { models } = require("../data/sequelize");

class UserService {
  async findById(id) {
    return await models.User.findOne({ where: { id: id } });
  }

  async findByDN(dn) {
    return await models.User.findOne({ where: { dn: dn }});
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
