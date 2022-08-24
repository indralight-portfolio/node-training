const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Auction.init(sequelize, DataTypes);
}

class Auction extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    msg: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    GoodId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'goods',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'auctions',
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UserId",
        using: "BTREE",
        fields: [
          { name: "UserId" },
        ]
      },
      {
        name: "GoodId",
        using: "BTREE",
        fields: [
          { name: "GoodId" },
        ]
      },
    ]
  });
  }
}
