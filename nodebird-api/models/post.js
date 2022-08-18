const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return post.init(sequelize, DataTypes);
}

class post extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    content: {
      type: DataTypes.STRING(140),
      allowNull: false
    },
    img: {
      type: DataTypes.STRING(200),
      allowNull: true
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
    tableName: 'posts',
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
        name: "UserId",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
  }
}
