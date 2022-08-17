const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const initModels = require('./init-models');

const db = {};
const sequelize = new Sequelize(config);

db.sequelize = sequelize;

const models = initModels(sequelize);

db.Models = models;

module.exports = db;
