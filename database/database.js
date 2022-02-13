const Sequelize = require("sequelize");

const connection = new Sequelize('node_blog', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-04:00'
});

module.exports = connection;