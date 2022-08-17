const DataTypes = require("sequelize").DataTypes;
const _comment = require("./comment");
const _user = require("./user");

function initModels(sequelize) {
  const comment = _comment(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);

  comment.belongsTo(user, { as: "commenter_user", foreignKey: "commenter" });
  user.hasMany(comment, { as: "comments", foreignKey: "commenter" });

  user.findOne;

  return {
    comment,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
