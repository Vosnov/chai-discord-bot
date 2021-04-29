import Discord from 'discord.js'
import {SendVkMemeCommand} from "./vk/send-vk-meme.command";
import {Clear} from "./clear";
import {RandomNumberCommand} from "./random-number-command";
import AddVkGroupsCommand from "./vk/add-vk-groups.command";
import RemoveVkGroupsCommand from "./vk/remove-vk-groups.command";
import ShowVkGroupsCommand from "./vk/show-vk-groups.command";
import HelpCommand from "./help.command";
import { ICommand } from './command';
import SendRandomGifCommand from './gif/send-random-gif.command';

export const PREFIX = 'c!'
const COOLDOWN_TIME = 5;
const cooldown = new Set()

export const commandHandler = (msg: Discord.Message) => {
  if (msg.author.bot) return;

  if (msg.content?.startsWith(PREFIX)) {
    if (cooldown.has(msg.author.id)) {
      msg.reply(`Охлади своё трахание на ${COOLDOWN_TIME} сек.`)
      return;
    } else {
      cooldown.add(msg.author.id)
      setTimeout(() => {
        cooldown.delete(msg.author.id)
      }, COOLDOWN_TIME * 1000)
    }

    const args = msg.content.slice(PREFIX.length).trim().split(' ');
    const commandName = args.shift()?.toLowerCase() || '';

    commands.forEach(command => {
      if (command.commandNames.includes(commandName)) {
        if (command.onlyManageGuild && !msg.member?.hasPermission('ADMINISTRATOR' || 'MANAGE_GUILD')) {
          msg.reply('У вас недостаточно прав для этой команды.')
          return
        }
        
        command.run(msg, args)
        return
      }
    })
  }
}

export const vkCommands = [
  new HelpCommand(),
  new AddVkGroupsCommand(),
  new RemoveVkGroupsCommand(),
  new ShowVkGroupsCommand(),
  new SendVkMemeCommand(),
  new Clear(),
  new RandomNumberCommand(),
]

export const gifCommands = [
  new SendRandomGifCommand(),
]

export const commands: ICommand[] = [
  ...vkCommands,
  ...gifCommands
]
