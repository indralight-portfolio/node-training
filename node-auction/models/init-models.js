const DataTypes = require("sequelize").DataTypes;
const _Auction = require("./auction");
const _Good = require("./good");
const _User = require("./user");

function initModels(sequelize) {
  const Auction = _Auction(sequelize, DataTypes);
  const Good = _Good(sequelize, DataTypes);
  const User = _User(sequelize, DataTypes);

  Auction.belongsTo(Good, { as: "Good", foreignKey: "GoodId"});
  Good.hasMany(Auction, { as: "auctions", foreignKey: "GoodId"});
  Auction.belongsTo(User, { as: "User", foreignKey: "UserId"});
  User.hasMany(Auction, { as: "auctions", foreignKey: "UserId"});
  Good.belongsTo(User, { as: "Owner", foreignKey: "OwnerId"});
  User.hasMany(Good, { as: "goods", foreignKey: "OwnerId"});
  Good.belongsTo(User, { as: "Sold", foreignKey: "SoldId"});
  User.hasMany(Good, { as: "Sold_goods", foreignKey: "SoldId"});

  return {
    Auction,
    Good,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
