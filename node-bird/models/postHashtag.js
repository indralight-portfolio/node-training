const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('postHashtag', {
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
};
