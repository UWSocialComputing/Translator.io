// General elements
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { token, apiKey } = require('./config.json');

// Translation elements
const deepl = require('deepl-node');
const translator = new deepl.Translator(apiKey);

// Database elements
const Keyv = require('keyv');
let server_default_keyv;
let user_default_keyv;
let channels_keyv;
refreshDatabases();
setInterval(() => {
	refreshDatabases();
}, 1000);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

// Respond to \ commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Auto-translates messages in channels it is enabled in
client.on(Events.MessageCreate, async msg => {
	if (msg.author.bot) return;
	const isEnabled = await channels_keyv.get(msg.channel.id);
	if (isEnabled) {
		const defaultLang = await server_default_keyv.get(msg.guild.id);
		const input = msg.content;
		let output;
		try {
			const result = await translator.translateText(input, null, defaultLang);
			output = result.text;
		}
		catch (error) {
			console.log(error);
			output = 'Something went wrong';
		}
		console.log('isEnabled: ' + isEnabled);
		console.log('defaultLang: ' + defaultLang);
		console.log('input: ' + input);
		console.log('output: ' + output);
		await msg.reply({ content: output, allowedMentions: { repliedUser: false } });
	}
});

client.login(token);

function refreshDatabases() {
	const server_default = path.join(__dirname, './../database/server_default.sqlite');
	server_default_keyv = new Keyv('sqlite://' + server_default);
	server_default_keyv.on('error', err => console.error('Keyv connection error:', err));
	const user_default = path.join(__dirname, './../database/user_default.sqlite');
	user_default_keyv = new Keyv('sqlite://' + user_default);
	user_default_keyv.on('error', err => console.error('Keyv connection error:', err));
	const channels = path.join(__dirname, './../database/channels.sqlite');
	channels_keyv = new Keyv('sqlite://' + channels);
	channels_keyv.on('error', err => console.error('Keyv connection error:', err));
}