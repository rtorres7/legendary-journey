const { models } = require("../data/sequelize");

class UserService {
  async findById(id) {
    return await models.User.findOne({ where: { id: id } });
  }

  async createUser(user) {
    const savedUser = await models.User.create(user);

    return savedUser;
  }

  async updateUser(id, user) {
    const user = await models.User.findOne({ where: { id: id } })
      .then(function (record) {
        return record.update({ user });
      })
      .then(function (record) {
        res.sendStatus(200);
      });
  }

  async validateUser(dn) {
    const foundUser = await models.User.findOne({ where: { dn: dn } });
    if (!foundUser) {
      console.log("Not found!");
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
      return foundUser;
    }
  }

  async deleteUser(id) {
    await models.User.destroy({ where: { id: id } });
  }

  async;
}
