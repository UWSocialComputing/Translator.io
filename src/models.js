const { Sequilize, DataTypes } = require('sequelize');
const { connectionString } = './config.json';

const sequelize = new Sequilize(connectionString);

const User = sequelize.define('User', {
	userId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	serverId: {
		type: DataTypes.STRING,
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

const Channel = sequelize.define('Channel', {
	serverId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	channelId: {
		type: DataTypes.STRING,
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

const Server = sequelize.define('Server', {
	serverId: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	defaultLanguage: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

Server.hasMany(User, { foreignKey: 'serverId' });
User.belongsTo(Server, { foreignKey: 'serverId' });

Server.hasMany(Channel, { foreignKey: 'serverId' });
Channel.belongsTo(Server, { foreignKey: 'serverId' });

module.exports = [User, Channel, Server];