import Discord from 'discord.js'
import {UserModel} from "../../models/user";
import {VkGroupModel} from "../../models/vkGroup";
import Command, { ICommand } from '../command';

export default class RemoveVkGroupsCommand extends Command implements ICommand {
  commandNames: string[] = ['remove', 'r'];
  description = 'Удалить группу из списка'

  async run(msg: Discord.Message, args: string[] | undefined): Promise<void> {
    const candidate = await UserModel.findOne({channelId: msg.guild?.id})
      .populate('vkGroup')
      .exec()
    const user = candidate ? candidate : this.createUserModel(msg)

    if (!args?.length) {
      const embed = new Discord.MessageEmbed()
        .setTitle('Какие сообщения удалить?')
        .setDescription('all - все ИЛИ номер группы. Номер группы можно посмотреть в `show`')
      msg.channel.send(embed)
      return
    }

    if (args[0] === 'all') {
      await VkGroupModel.deleteMany({ownerId: user._id})
      user.vkGroup = []
      await user.save();
    } else {
      const groupNumbers = args.map(arg => Number(arg)).filter(num => !!num);

      if (!groupNumbers.length) {
        const command = '`' + this.commandNames[0] + '`'
        const description = 'Команда ' + command + ' может принимать только числа'
        this.sendDefaultMessage(description, this.errorColor, msg)
        return
      }

      for (const num of groupNumbers) {
        const group = user.vkGroup[num - 1];
        if (group) {
          user.vkGroup = user.vkGroup.filter(userGroup => userGroup._id !== group._id)
          group.delete()
        } else {
          this.sendDefaultMessage(`Группа под номером: ${num} не найдеа`, this.errorColor, msg)
          return
        }
      }

      await user.save()
    }

    const description = args.length > 1 ? 'Группы удалены!' : 'Группа удалена!'
    this.sendDefaultMessage(description, this.color, msg)
  }

}