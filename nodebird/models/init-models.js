const DataTypes = require("sequelize").DataTypes;
const _Domain = require("./domain");
const _Follow = require("./follow");
const _Hashtag = require("./hashtag");
const _PostHashtag = require("./postHashtag");
const _Post = require("./post");
const _User = require("./user");

function initModels(sequelize) {
  const Domain = _Domain(sequelize, DataTypes);
  const Follow = _Follow(sequelize, DataTypes);
  const Hashtag = _Hashtag(sequelize, DataTypes);
  const PostHashtag = _PostHashtag(sequelize, DataTypes);
  const Post = _Post(sequelize, DataTypes);
  const User = _User(sequelize, DataTypes);

  Hashtag.belongsToMany(Post, { as: 'postId_posts', through: PostHashtag, foreignKey: "hashtagId", otherKey: "postId" });
  Post.belongsToMany(Hashtag, { as: 'hashtagId_hashtags', through: PostHashtag, foreignKey: "postId", otherKey: "hashtagId" });
  User.belongsToMany(User, { as: 'followerId_users', through: Follow, foreignKey: "followingId", otherKey: "followerId" });
  User.belongsToMany(User, { as: 'followingId_users', through: Follow, foreignKey: "followerId", otherKey: "followingId" });
  PostHashtag.belongsTo(Hashtag, { as: "hashtag", foreignKey: "hashtagId"});
  Hashtag.hasMany(PostHashtag, { as: "postHashtags", foreignKey: "hashtagId"});
  PostHashtag.belongsTo(Post, { as: "post", foreignKey: "postId"});
  Post.hasMany(PostHashtag, { as: "postHashtags", foreignKey: "postId"});
  Domain.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Domain, { as: "domains", foreignKey: "userId"});
  Follow.belongsTo(User, { as: "following", foreignKey: "followingId"});
  User.hasMany(Follow, { as: "follows", foreignKey: "followingId"});
  Follow.belongsTo(User, { as: "follower", foreignKey: "followerId"});
  User.hasMany(Follow, { as: "follower_follows", foreignKey: "followerId"});
  Post.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Post, { as: "posts", foreignKey: "userId"});

  return {
    Domain,
    Follow,
    Hashtag,
    PostHashtag,
    Post,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
