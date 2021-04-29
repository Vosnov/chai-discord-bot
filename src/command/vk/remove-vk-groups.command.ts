import Discord from 'discord.js'
import { MemeModel } from '../../models/meme';
import {IUserModel, UserModel} from "../../models/user";
import {VkGroupModel} from "../../models/vkGroup";
import Command, { ICommand } from '../command';

export default class RemoveVkGroupsCommand extends Command implements ICommand {
  commandNames: string[] = ['remove', 'r']
  description = 'Удалить группу из списка'
  onlyManageGuild = true

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

      this.sendDefaultMessage('Группы удалены!', this.color, msg)
    } else {
      const groupNumbers = args.map(arg => Number(arg)).filter(num => !!num);

      if (!groupNumbers.length) {
        const command = '`' + this.commandNames[0] + '`'
        const description = 'Команда ' + command + ' может принимать только числа'
        this.sendDefaultMessage(description, this.errorColor, msg)
        return
      }

      const accept = async () => {
        user.queue = []
        MemeModel.deleteMany({ownerId: user._id})
        await user.save()
        const description = args.length > 1 ? 'Группы удалены!' : 'Группа удалена!'
        this.sendDefaultMessage(description, this.color, msg)
      }

      const err = (num: number) => {
        this.sendDefaultMessage(`Группа под номером: ${num} не найдеа`, this.errorColor, msg)
      }

      this.deleteGroups(groupNumbers, user, accept, err)
    }
  }

  deleteGroups(groupNumbers: number[], user: IUserModel, accept: () => void, err: (num: number) => void) {
    for (const num of groupNumbers) {
      const group = user.vkGroup[num - 1];
      if (group) {
        user.vkGroup = user.vkGroup.filter(userGroup => userGroup._id !== group._id)
        group.delete()
      } else {
        err(num)
        return
      }
    }

    accept()
  }

}