import Discord from 'discord.js'
import dotnev from 'dotenv'
import {CommandHandler, PREFIX} from "./command/command-handler";

dotnev.config()
const client = new Discord.Client()
const commandHandler = new CommandHandler()

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag || ''}!`)
});

client.on('message', msg => commandHandler.run(msg));

const start = async () => {
  await client.login(process.env.BOT_TOKEN);
  client.user?.setActivity(`${PREFIX}help - to help`, { type: 'PLAYING' });
}

start()

