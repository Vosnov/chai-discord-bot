import Discord from 'discord.js'
import {UserModel} from "../../models/user";
import Command, { ICommand } from '../command';
import { vkCommands } from '../command-handler';

export default class ShowVkGroupsCommand extends Command implements ICommand {
  commandNames: string[] = ['show', 's'];
  description = 'Просмотр групп из списка'

  async run(msg: Discord.Message, args: string[] | undefined): Promise<void> {
    const candidate = await UserModel.findOne({channelId: msg.guild?.id})
      .populate('vkGroup')
      .exec()
    const user = candidate ? candidate : await this.createUserModel(msg)

    if (!user.vkGroup.length) {
      this.sendDefaultMessage('Список групп пуст! Группы можно пополонить командой `add`', this.color, msg)
      return
    }

    const groupNames = user.vkGroup.map((group, index) => `${index + 1}) ${group.name}`)

    const embed = new Discord.MessageEmbed()
      .setColor(this.color)
      .addField('Список групп:', '```' + groupNames.join('\n') + '```')

    msg.channel.send(embed)
  }

}