import Discord from 'discord.js'
import {VkService} from "../../services/vk.service";
import {UserModel} from "../../models/user";
import {IVkGroupModel, VkGroupModel} from "../../models/vkGroup";
import Command, {ICommand} from "../command";

export default class AddVkGroupsCommand extends Command implements ICommand {
  commandNames = ['add', 'a'];
  description = 'Добавить группу в спиcок'

  readonly GROUP_LIMIT = 10;

  async run(msg: Discord.Message, args: string[] | undefined) {
    const candidate = await UserModel.findOne({channelId: msg.guild?.id})
      .populate('VkGroup')
      .exec()
    const user = candidate ? candidate : this.createUserModel(msg)

    if (user.vkGroup.length >= this.GROUP_LIMIT) {
      this.sendDefaultMessage(
        `Превышен лимит групп. Макс. число групп ${this.GROUP_LIMIT}`,
        this.errorColor,
        msg
      )
      return
    }

    if (!args?.length) {
      const embed = new Discord.MessageEmbed()
        .setColor(this.color)
        .setTitle('Какие группы добавить?')
        .addField('Пример:', 'https://vk.com/myGroup \n ИЛИ \n myGroup')
      msg.channel.send(embed)
      return
    }

    let groups = await new VkService().findGroups(args)

    if (!groups.length) {
      this.sendDefaultMessage('Ошибка! Введите корректный адрес группы.', this.errorColor, msg)
      return
    }

    const groupModels: IVkGroupModel[] = []
    groups.forEach(group => {
      const model = new VkGroupModel({...group, ownerId: user._id})
      groupModels.push(model)
      model.save()
    })

    user.vkGroup.push(...groupModels)
    user.queue = []
    await user.save()
    const description = args.length > 1 ? 'Группы успешно сохранены!' : 'Группа успешно сохранена!'
    this.sendDefaultMessage(description, this.color, msg)
  }

}