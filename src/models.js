const { Sequilize, DataTypes } = require('sequelize');
const { connectionString } = './config.json';

const sequelize = new Sequilize(connectionString);

const UsersRegistered = sequelize.define('UserRegistered', {
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	serverId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	language: {
		type: DataTypes.STRING,
		allowNull: false,
	} },
{
	indexes: [
		{
			unique: true,
			fields: ['userId', 'serverId'],
		},
	],
},
);

const EnabledChannels = sequelize.define('EnabledChannels', {
	serverId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	isEnabled: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
},
{
	indexes: [
		{
			unique: true,
			fields: ['serverId', 'userId'],

		},
	],
},
);


module.exports = [UsersRegistered, EnabledChannels];