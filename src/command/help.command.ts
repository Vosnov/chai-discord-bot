import Discord, {User} from 'discord.js';
import Command, { ICommand } from './command';
import {commands} from './command-handler'

export default class HelpCommand extends Command implements ICommand {
  commandNames: string[] = ['help'];
  description = 'Список команд'
  addRemoveDescription = 'add, `remove` - могут принимать несколько параметров. \n'
  loadDescription = '`load` - по умолчанию загружает 0`ю страницу. \n'

  async run(msg: Discord.Message, args: string[] | undefined) {
    const cmdNames = commands.map(cmd => cmd.commandNames.join(', ') + ` - ${cmd.description}`).join('\n')
    const embed = new Discord.MessageEmbed()
      .setColor(this.color)
      .setTitle('Помощь')
      .addField('Vk Memes', this.addRemoveDescription + this.loadDescription + '```' + cmdNames + '```')

    msg.channel.send(embed)
  }

}
