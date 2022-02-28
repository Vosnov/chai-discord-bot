import Discord from 'discord.js'
import { container } from '../../container';
import Command, { Channel, ICommand } from '../command';

export default class RemoveVkGroupsCommand extends Command implements ICommand {
  commandNames: string[] = ['remove', 'r']
  description = 'Удалить группу из списка'
  onlyManageGuild = true
  container = container

  async run(msg: Channel, args: string[] | undefined): Promise<void> {
    if (!args?.length) {
      const embed = new Discord.MessageEmbed()
        .setTitle('Какие сообщения удалить?')
        .setDescription('all - все ИЛИ номер группы. Номер группы можно посмотреть в `show`')
      msg.send(embed)
      return
    }

    if (args[0] === 'all') {
      this.container.setMemes([])
      this.container.setGroups([])

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
        this.container.setMemes([])
        const description = args.length > 1 ? 'Группы удалены!' : 'Группа удалена!'
        this.sendDefaultMessage(description, this.color, msg)
      }

      const err = (num: number) => {
        this.sendDefaultMessage(`Группа под номером: ${num} не найдеа`, this.errorColor, msg)
      }

      this.deleteGroups(groupNumbers, accept, err)
    }
  }

  deleteGroups(groupNumbers: number[], accept: () => void, err: (num: number) => void) {
    for (const num of groupNumbers) {
      const groups = this.container.getGroups()
      const group = groups[num - 1];
      if (group) {
        this.container.setGroups(groups.filter(userGroup => userGroup.groupId !== group.groupId))
      } else {
        err(num)
        return
      }
    }

    accept()
  }

}