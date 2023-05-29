const { Sequelize, DataTypes } = require('sequelize');
const { database, username, password, dialect, host, port } = require('./config.json');

const sequelize = new Sequelize(database, username, password, {
	dialect: dialect,
	host: host,
	port: port,
});

try {
	sequelize.authenticate();
	console.log('Connection was successful');
}
catch (error) {
	console.log('Database connection was not successful: ' + error);
}

const User = sequelize.define('Users', {
	userId: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
	},
	serverId: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
	},
	language: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	searchable: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
},
);

const Channel = sequelize.define('Channels', {
	serverId: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
	},
	channelId: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
	},
	isEnabled: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
},
);

const Server = sequelize.define('Servers', {
	serverId: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
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

module.exports = { User, Channel, Server };