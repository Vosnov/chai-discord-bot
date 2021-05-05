import Discord from 'discord.js'
import {SendVkMemeCommand} from "./vk/send-vk-meme.command";
import {Clear} from "./clear";
import {RandomNumberCommand} from "./random-number-command";
import AddVkGroupsCommand from "./vk/add-vk-groups.command";
import RemoveVkGroupsCommand from "./vk/remove-vk-groups.command";
import ShowVkGroupsCommand from "./vk/show-vk-groups.command";
import HelpCommand from "./help.command";
import Command, { ICommand } from './command';
import SendRandomGifCommand from './gif/send-random-gif.command';

export const PREFIX = 'c!'
const COOLDOWN_TIME = 5;
const cooldown = new Set()

export class CommandHandler extends Command {
  requiredPermissions: Discord.PermissionString[] = ['ATTACH_FILES', 'EMBED_LINKS']

  run(msg: Discord.Message) {
    if (msg.author.bot) return
    if (!msg.content?.startsWith(PREFIX)) return

    if (cooldown.has(msg.author.id)) {
      msg.reply(`Охладись на ${COOLDOWN_TIME} сек.`)
      return;
    } else {
      cooldown.add(msg.author.id)
      setTimeout(() => {
        cooldown.delete(msg.author.id)
      }, COOLDOWN_TIME * 1000)
    }

    const args = msg.content.slice(PREFIX.length).trim().split(' ')
    const commandName = args.shift()?.toLowerCase() || ''

    if (!msg.guild?.me?.hasPermission('SEND_MESSAGES')) return
    if (!msg.guild?.me?.hasPermission(this.requiredPermissions)) {
      this.missPermissionsMessage(msg)
      return
    }
    
    const channelPermission = (msg.channel as Discord.TextChannel)
      .permissionsFor(msg.guild.me)

    if (!channelPermission?.has('SEND_MESSAGES')) return
    if (!channelPermission?.has(this.requiredPermissions)) {
      msg.channel.send('Эй у меня нет прав на этом канале!')
      return
    }

    commands.forEach(command => {
      if (command.commandNames.includes(commandName)) {
        if (command.onlyManageGuild && !msg.member?.hasPermission(['ADMINISTRATOR', 'MANAGE_GUILD'])) {
          msg.reply('У вас недостаточно прав для этой команды.')
          return
        }

        try {
          command.run(msg, args)
        } catch (e) {
          console.log(e)
          msg.reply('Упс! Что-то пошло не так, попробуй позже.')
        }
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
