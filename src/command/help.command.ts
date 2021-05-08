import Discord from 'discord.js';
import Command, { ICommand } from './command';
import {gifCommands, utilsCommands, vkCommands} from './command-handler'

export default class HelpCommand extends Command implements ICommand {
  commandNames: string[] = ['help'];
  description = 'Список команд.'

  // vk
  addRemoveDescription = '`add`, `remove` - могут принимать несколько параметров через пробел. \n'
  // gif
  gifDescription = '`gif`, `g` - могут принмать ключевое слово в качастве параметра. \n' +
    'Например: `gif meme`. \n'

  getCmdNames(commands: ICommand[]) {
    return commands.map(cmd => {
      const manageGuild = cmd.onlyManageGuild ? '* ' : ''
      return manageGuild + cmd.commandNames.join(', ') + ` - ${cmd.description}`
    }).join('\n')
  }

  async run(msg: Discord.Message, args: string[] | undefined) {
    const vkCmdNames = this.getCmdNames(vkCommands)
    const gifCmdNames = this.getCmdNames(gifCommands)
    const utilsCommand = this.getCmdNames(utilsCommands)

    const embed = new Discord.MessageEmbed()
      .setDescription('`*` - Только для владельцев возможности "Управлять сервером" или выше.')
      .setColor(this.color)
      .setTitle('Помощь')
      .addField('Vk', this.addRemoveDescription + '```' + vkCmdNames + '```')
      .addField('Gifs', this.gifDescription + '```' + gifCmdNames + '```')
      .addField('NSFW', 'Узнать больше можно используя команду `nsfw`')
      .addField('Разное', '```' +  utilsCommand + '```') 

    msg.channel.send(embed)
  }

}
