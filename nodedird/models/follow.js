const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return follow.init(sequelize, DataTypes);
}

class follow extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'follow',
    timestamps: true,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "followingId" },
          { name: "followerId" },
        ]
      },
      {
        name: "followerId",
        using: "BTREE",
        fields: [
          { name: "followerId" },
        ]
      },
    ]
  });
  }
}
