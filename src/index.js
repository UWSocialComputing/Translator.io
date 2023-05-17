// General elements
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { token, apiKey } = require('./config.json');

// Translation elements
const deepl = require('deepl-node');
const translator = new deepl.Translator(apiKey);

// sequilize elements
const { User, Channel, Server } = require('./models');

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
const filesPath = path.join(__dirname, 'commands/actual');
const files = fs.readdirSync(filesPath);

for (const file of files) {
	console.log(file);
	const filePath = path.join(filesPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, async () => {
	await Server.sync();
	await Channel.sync();
	await User.sync();
	console.log('Bot is ready!');
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
	const serverId = msg.guildId;
	const channelId = msg.channelId;
	const userId = msg.author.id;
	const channel = await Channel.findOne({ where: { serverId: serverId, channelId: channelId } });
	if (channel == null) {
		return;
	}
	if (channel['isEnabled']) {
		const user = await User.findOne({ where: { userId: userId, serverId: serverId } });
		const server = await Server.findOne({ where: { serverId: serverId } });
		let targetLang;
		let input = msg.content;
		let output;
		if (user != null) {
			targetLang = user['language'];
		}
		else if (server != null) {
			targetLang = server['defaultLanguage'];
			input += '\n[You have not registered a language. Use the /register command to register your preferred language.]';
		}
		else {
			targetLang = 'EN-US';
			input += '\n[You have not registered a language. Use the /register command to register your preferred language.]';
		}
		try {
			const result = await translator.translateText(input, null, targetLang);
			output = result.text;
		}
		catch (error) {
			console.log(error);
			output = 'Sorry, there is a problem with our translator.';
		}
		await msg.reply({ content: output, allowedMentions: { repliedUser: false } });
	}
});

client.login(token);