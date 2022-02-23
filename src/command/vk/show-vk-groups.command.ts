import Discord from 'discord.js'
import { container } from '../../container';
import Command, { ICommand } from '../command';

export default class ShowVkGroupsCommand extends Command implements ICommand {
  commandNames: string[] = ['show', 's'];
  description = 'Просмотр групп из списка'
  container = container

  async run(msg: Discord.Message, args: string[] | undefined): Promise<void> {
    if (!this.container.getGroups().length) {
      this.sendDefaultMessage('Список групп пуст! Группы можно пополонить командой `add`', this.color, msg)
      return
    }

    const groupNames = this.container.getGroups().map((group, index) => `${index + 1}) ${group.name}`)

    const embed = new Discord.MessageEmbed()
      .setColor(this.color)
      .addField('Список групп:', '```' + groupNames.join('\n') + '```')

    msg.channel.send(embed)
  }

}