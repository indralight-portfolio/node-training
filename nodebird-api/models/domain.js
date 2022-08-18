const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return domain.init(sequelize, DataTypes);
}

class domain extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    host: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('free','premium'),
      allowNull: false
    },
    clientSecret: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'domains',
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
        name: "userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
  }
}
