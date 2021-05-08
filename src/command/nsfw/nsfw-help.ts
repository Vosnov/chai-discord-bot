import Discord from 'discord.js';
import Command, { ICommand } from '../command';
import { nsfmCommands } from '../command-handler'

export default class NsfwHelp extends Command implements ICommand {
  commandNames: string[] = ['nsfw'];
  description = 'Список nsfw команд.'
  nsfwContent = true

  getCmdNames(commands: ICommand[]) {
    return commands.map(cmd => {
      return '- ' + cmd.commandNames.join(', ') + ` - ${cmd.description}`
    }).join('\n')
  }

  async run(msg: Discord.Message, args: string[] | undefined) {
    const embed = new Discord.MessageEmbed()
      .setDescription('```' + this.getCmdNames(nsfmCommands) + '```')
      .setColor(this.color)
      .setTitle('NSWF')

    msg.channel.send(embed)
  }

}
