const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Good.init(sequelize, DataTypes);
}

class Good extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    img: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    OwnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    SoldId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'goods',
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
        name: "OwnerId",
        using: "BTREE",
        fields: [
          { name: "OwnerId" },
        ]
      },
      {
        name: "SoldId",
        using: "BTREE",
        fields: [
          { name: "SoldId" },
        ]
      },
    ]
  });
  }
}
