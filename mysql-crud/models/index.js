const Sequelize = require("sequelize");
var initModels = require("./init-models");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const sequelize = new Sequelize(config);

db.sequelize = sequelize;

var models = initModels(sequelize);

db.User = models.user;
db.Comment = models.comment;

module.exports = db;
