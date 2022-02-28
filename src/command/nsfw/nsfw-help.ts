import Discord from 'discord.js';
import Command, { Channel, ICommand } from '../command';
import MessageCommands from '../msg-commands';

export default class NsfwHelp extends Command implements ICommand {
  commandNames: string[] = ['nsfw'];
  description = 'Список nsfw команд.'
  nsfwContent = true

  getCmdNames(commands: ICommand[]) {
    return commands.map(cmd => {
      return '- ' + cmd.commandNames.join(', ') + ` - ${cmd.description}`
    }).join('\n')
  }

  async run(msg: Channel, args: string[] | undefined) {
    const embed = new Discord.MessageEmbed()
      .setDescription('```' + this.getCmdNames(MessageCommands.nsfwMsgCommand.value) + '```')
      .setColor(this.color)
      .setTitle('NSWF')

    msg.send(embed)
  }

}
