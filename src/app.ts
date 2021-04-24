import Discord from 'discord.js'
import dotnev from 'dotenv'
import {commandHandler} from "./command/command-handler";
import mongoose from 'mongoose'

dotnev.config()
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag || ''}!`);
});

client.on('message', msg => commandHandler(msg));

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  await client.login(process.env.BOT_TOKEN);
  client.user?.setActivity('!help - to help', { type: 'PLAYING' });
}

start()
