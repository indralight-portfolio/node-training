const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return hashtag.init(sequelize, DataTypes);
}

class hashtag extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: "title"
    }
  }, {
    sequelize,
    tableName: 'hashtags',
    timestamps: true,
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
        name: "title",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "title" },
        ]
      },
    ]
  });
  }
}
