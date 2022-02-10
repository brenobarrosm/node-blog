const Sequelize = require("sequelize");

const connection = new Sequelize('node_blog', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;