const DataTypes = require("sequelize").DataTypes;
const _follow = require("./follow");
const _hashtag = require("./hashtag");
const _postHashtag = require("./postHashtag");
const _post = require("./post");
const _user = require("./user");

function initModels(sequelize) {
  const follow = _follow(sequelize, DataTypes);
  const hashtag = _hashtag(sequelize, DataTypes);
  const postHashtag = _postHashtag(sequelize, DataTypes);
  const post = _post(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);

  hashtag.belongsToMany(post, { as: 'postId_posts', through: postHashtag, foreignKey: "hashtagId", otherKey: "postId" });
  post.belongsToMany(hashtag, { as: 'hashtagId_hashtags', through: postHashtag, foreignKey: "postId", otherKey: "hashtagId" });
  user.belongsToMany(user, { as: 'followerId_users', through: follow, foreignKey: "followingId", otherKey: "followerId" });
  user.belongsToMany(user, { as: 'followingId_users', through: follow, foreignKey: "followerId", otherKey: "followingId" });
  postHashtag.belongsTo(hashtag, { as: "hashtag", foreignKey: "hashtagId"});
  hashtag.hasMany(postHashtag, { as: "postHashtags", foreignKey: "hashtagId"});
  postHashtag.belongsTo(post, { as: "post", foreignKey: "postId"});
  post.hasMany(postHashtag, { as: "postHashtags", foreignKey: "postId"});
  follow.belongsTo(user, { as: "following", foreignKey: "followingId"});
  user.hasMany(follow, { as: "follows", foreignKey: "followingId"});
  follow.belongsTo(user, { as: "follower", foreignKey: "followerId"});
  user.hasMany(follow, { as: "follower_follows", foreignKey: "followerId"});
  post.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(post, { as: "posts", foreignKey: "userId"});

  return {
    follow,
    hashtag,
    postHashtag,
    post,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
