const DataTypes = require("sequelize").DataTypes;
const _comments = require("./comments");
const _users = require("./users");

function initModels(sequelize) {
  const comments = _comments(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  comments.belongsTo(users, { as: "commenter_user", foreignKey: "commenter"});
  users.hasMany(comments, { as: "comments", foreignKey: "commenter"});

  return {
    comments,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
