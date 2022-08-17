const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return postHashtag.init(sequelize, DataTypes);
}

class postHashtag extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    hashtagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'hashtags',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'postHashtag',
    timestamps: true,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "postId" },
          { name: "hashtagId" },
        ]
      },
      {
        name: "postHashtag_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "hashtagId" },
        ]
      },
    ]
  });
  }
}
