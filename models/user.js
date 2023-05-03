const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('user', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true,
	},
	name: Sequelize.STRING,
	email: {
		type: Sequelize.STRING,
		unique: true,
	},
	password: Sequelize.STRING,
	phNo: {
		type: Sequelize.STRING,
		unique: true,
	},
});

module.exports = User;