const { REST, Routes, GatewayIntentBits, Client, Events, Collection } = require('discord.js');

const client = new Client({ intents: 131071 });

const fs = require('node:fs');
const path = require('node:path');


const token = process.env['token']

client.commands = new Collection();

const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command?.data?.toJSON());
	client.commands.set(command?.data?.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
const rest = new REST({ version: '10' }).setToken(token);
require('./MongoDb/connect');
require('./uptime');
client.once(Events.ClientReady, async (bot) => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(bot.user.id),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})

process.on('uncaughtException',async (Error) => {
  return console.log(Error)
})
process.on('unhandledRejection',async (Error) => {
  return console.log(Error)
})

client.login(token)