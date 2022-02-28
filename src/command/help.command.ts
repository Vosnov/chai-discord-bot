import Discord from 'discord.js';
import Command, { Channel, ICommand } from './command';
import MessageCommands from './msg-commands';

export default class HelpCommand extends Command implements ICommand {
  commandNames: string[] = ['help'];
  description = 'Список команд.'

  getCmdNames(commands: ICommand[]) {
    return commands.map(cmd => {
      const manageGuild = cmd.onlyManageGuild ? '* ' : ''
      return manageGuild + cmd.commandNames.join(', ') + ` - ${cmd.description}`
    }).join('\n')
  }

  styleDescription(description: string) {
    return '```' + description + '```'
  }

  async run(msg: Channel, args: string[] | undefined) {
    const {gifMsgCommand, vkMsgCommand, nsfwMsgCommand, utilsMsgCommand} = MessageCommands

    const embed = new Discord.MessageEmbed()
      .setDescription('`*` - Только для владельцев возможности "Управлять сервером" или выше.')
      .setColor(this.color)
      .setTitle('Помощь')
      .addField(vkMsgCommand.name, this.styleDescription(vkMsgCommand.description))
      .addField(gifMsgCommand.name, this.styleDescription(gifMsgCommand.description))
      .addField(nsfwMsgCommand.name, nsfwMsgCommand.description)
      .addField(utilsMsgCommand.name, this.styleDescription(utilsMsgCommand.description)) 

    msg.send(embed)
  }

}
