import Discord from 'discord.js';
import Command, { ICommand } from './command';
import {gifCommands, vkCommands} from './command-handler'

export default class HelpCommand extends Command implements ICommand {
  commandNames: string[] = ['help', 'h'];
  description = 'Список команд'
  // vk
  addRemoveDescription = '`add`, `remove` - могут принимать несколько параметров. \n'
  // gif
  gifDescription = '`gif`, `g` - могут принмать ключевое слово (на английском) в качастве параметра. \n' +
    'Например: `gif meme`. \n'

  getCmdNames(commands: ICommand[]) {
    return commands.map(cmd => cmd.commandNames.join(', ') + ` - ${cmd.description}`).join('\n')
  }

  async run(msg: Discord.Message, args: string[] | undefined) {
    const vkCmdNames = this.getCmdNames(vkCommands)
    const gifCmdNames = this.getCmdNames(gifCommands)

    const embed = new Discord.MessageEmbed()
      .setColor(this.color)
      .setTitle('Помощь')
      .addField('Vk Memes', this.addRemoveDescription + '```' + vkCmdNames + '```')
      .addField('Gifs', this.gifDescription + '```' + gifCmdNames + '```')

    msg.channel.send(embed)
  }

}
