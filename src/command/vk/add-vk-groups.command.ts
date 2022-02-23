import Discord from 'discord.js'
import {VkService} from "../../services/vk.service";
import Command, {ICommand} from "../command";
import { container } from '../../container';

export default class AddVkGroupsCommand extends Command implements ICommand {
  commandNames = ['add', 'a'];
  description = 'Добавить группу в спиcок'
  onlyManageGuild = true
  container = container

  readonly GROUP_LIMIT = 10;

  async run(msg: Discord.Message, args: string[] | undefined) {
    if (this.container.getGroups().length >= this.GROUP_LIMIT) {
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

    this.container.setGroups(groups)
    this.container.setMemes([])

    const description = args.length > 1 ? 'Группы успешно сохранены!' : 'Группа успешно сохранена!'
    this.sendDefaultMessage(description, this.color, msg)
  }

}