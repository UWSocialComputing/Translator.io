// General elements
const fs = require('node:fs');
const path = require('node:path');
const flags = require('./../resource/flags.json');
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

	const channel = await client.channels.fetch(channelId);
	const members = channel.members;


	for (const member of members.values()) {
		if (member.user.username == 'Translator.io') continue;
		if (member.id == msg.member.id) continue;
		await sendTranslationToUser(msg, serverId, channelId, member);
	}

});

async function sendTranslationToUser(msg, serverId, channelId, targetUser) {
	const targetUserId = targetUser.id;
	const channel = await Channel.findOne({ where: { serverId: serverId, channelId: channelId } });
	if (channel == null) {
		return;
	}
	if (channel['isEnabled']) {
		const user = await User.findOne({ where: { userId: targetUserId, serverId: serverId } });
		const server = await Server.findOne({ where: { serverId: serverId } });
		let targetLang;
		const inputs = [
			msg.content,
			'Automatic Translation',
			'Link to message',
			'Server name',
			'Channel name',
			'Original Message from',
			'Translated message for'];
		const outputs = [];
		if (user != null) {
			targetLang = user['language'];
		}
		else if (server != null) {
			targetLang = server['defaultLanguage'];
			inputs[0] += '\n[You have not registered a language. Use the /register command to register your preferred language.]';
		}
		else {
			targetLang = 'EN-US';
			inputs[0] += '\n[You have not registered a language. Use the /register command to register your preferred language.]';
		}
		try {
			for (let i = 0; i < inputs.length; i++) {
				const result = await translator.translateText(inputs[i], null, targetLang);
				outputs.push(result.text);
			}
		}
		catch (error) {
			console.log(error);
			outputs[0] = 'Sorry, there is a problem with our translator.';
		}
		const embed = {
			color: 0x0099ff,
			// Automatic Translation
			title: `${outputs[1]} ${flags[targetLang]}`,
			// EX: 'Link to message: for nameOfTargetUser'
			description: `${outputs[2]}: ${msg.url}`,
			fields: [
				{
					// Server Name
					name: `${outputs[3]}`,
					value: `${msg.guild.name}`,
				},
				{
					// Channel Name
					name: `${outputs[4]}`,
					value: `${msg.channel.name}`,
				},
				{
					// Ex: Original Message from nameOfOriginalUser
					name: `${outputs[5]} ${msg.member.user.username}`,
					value: `${inputs[0]}`,
				},
				{
					// Ex: Translated Message for nameOfTargetUser
					name: `${outputs[6]} ${targetUser.user.username}`,
					value: `${outputs[0]}`,
				},
			],
		};
		await client.users.send(targetUserId, { embeds: [embed] });
	}
}

client.login(token);