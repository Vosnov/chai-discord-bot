import Discord from 'discord.js'
import {VkService} from "../../services/vk.service";
import {UserModel} from "../../models/user";
import {IGroup, IVkGroupModel, VkGroupModel} from "../../models/vkGroup";
import Command, {ICommand} from "../command";

export default class AddVkGroupsCommand extends Command implements ICommand {
  commandNames = ['add', 'a'];
  description = 'Добавить группу в спсиок'

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
    const filteredGroups = groups.filter(group => group !== undefined) as IGroup[]

    if (!filteredGroups.length) {
      this.sendDefaultMessage('Ошибка! Введите корректный адрес группы.', this.errorColor, msg)
      return
    }

    const groupModels: IVkGroupModel[] = []
    filteredGroups.forEach(group => {
      const model = new VkGroupModel({...group, ownerId: user._id})
      groupModels.push(model)
      model.save()
    })

    user.vkGroup.push(...groupModels)
    await user.save()
    this.sendDefaultMessage("Группы успешно сохранены!", this.color, msg)
  }

}