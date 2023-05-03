const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Chats = sequelize.define('chat', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	message: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

module.exports = Chats;
