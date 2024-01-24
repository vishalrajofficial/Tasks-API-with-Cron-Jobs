const { Sequelize } = require('sequelize');
const config = require('./globalConfig');

const { host, port, user, password, database } = config.db;

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: host,
  port: port,
  username: user,
  password: password,
  database: database,
  logging: false,
});

module.exports = sequelize;
