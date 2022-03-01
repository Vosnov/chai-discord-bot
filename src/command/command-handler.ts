import Discord, { TextChannel } from 'discord.js'
import HelpCommand from "./help.command";
import Command, { ICommand } from './command';
import NsfwHelp from '../command/nsfw/nsfw-help'
import MessageCommands from './msg-commands';
import { CacheModel } from '../models/cache';

export const PREFIX = 'c!'
const COOLDOWN_TIME = 5;
const cooldown = new Set()


const allCommands: ICommand[] = [
  new HelpCommand(),
  new NsfwHelp(),
  ...MessageCommands.getValues()
]

export class CommandHandler extends Command {
  requiredPermissions: Discord.PermissionString[] = ['ATTACH_FILES', 'EMBED_LINKS']

  async start(client: Discord.Client) {
    const cacheModels = await CacheModel.find({})

    cacheModels.forEach(async (cacheModel) => {
      const channel = await client.channels.fetch(cacheModel.channelId)
      if (channel.isText()) {
        if (channel instanceof Discord.TextChannel) {
          allCommands.forEach(command => {
            if (command.runOnStart) command.runOnStart(channel)
          })
        }
      }
    })
  }

  async readCache(channelId: string) {
    return CacheModel.findOne({channelId})
  }

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

    allCommands.forEach(command => {
      if (command.commandNames.includes(commandName)) {
        if (command.onlyManageGuild && !msg.member?.hasPermission(['ADMINISTRATOR', 'MANAGE_GUILD'])) {
          msg.reply('У вас недостаточно прав для этой команды.')
          return
        }

        if (command.nsfwContent && !(msg.channel as TextChannel)?.nsfw) {
          msg.reply('Команда может быть использована только на NSFW каналах!')
          return
        }
        
        command.run(msg.channel, args).catch(e => {
          console.log('Request error', msg.content)
          msg.reply('Упс! Что-то пошло не так, попробуйте позже.')
        })
      }
    })
  }
}

