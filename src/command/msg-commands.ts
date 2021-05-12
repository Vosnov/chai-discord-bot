import { Clear } from "./utils/clear"
import { ICommand } from "./command"
import SendRandomGifCommand from "./gif/send-random-gif.command"
import SendHentaiCommand from "./nsfw/send-hentai"
import SendHentaiGifCommand from "./nsfw/send-hentai-gif"
import { RandomNumberCommand } from "./utils/random-number-command"
import AddVkGroupsCommand from "./vk/add-vk-groups.command"
import RemoveVkGroupsCommand from "./vk/remove-vk-groups.command"
import { SendVkMemeCommand } from "./vk/send-vk-meme.command"
import ShowVkGroupsCommand from "./vk/show-vk-groups.command"

class MessageCommand {
  name: string
  value: ICommand[] = []
  description: string

  constructor(name: string, value: ICommand[], description?: string) {
    this.name = name
    this.value = value

    if (!description) {
      description = this.getCmdNames(value)
    } 

    this.description = description
  }

  getCmdNames(commands: ICommand[]) {
    return commands.map(cmd => {
      const manageGuild = cmd.onlyManageGuild ? '* ' : ''
      return manageGuild + cmd.commandNames.join(', ') + ` - ${cmd.description}`
    }).join('\n')
  }
}

export default class MessageCommands {
  static vkMsgCommand = new MessageCommand('Vk', [
    new AddVkGroupsCommand(),
    new RemoveVkGroupsCommand(),
    new ShowVkGroupsCommand(),
    new SendVkMemeCommand(),
  ])

  static gifMsgCommand = new MessageCommand('Gifs', [
    new SendRandomGifCommand(),
  ])

  static nsfwMsgCommand = new MessageCommand('NSFW', [
    new SendHentaiCommand(),
    new SendHentaiGifCommand(),
  ], 'Узнать больше можно используя команду `nsfw`')

  static utilsMsgCommand = new MessageCommand('Разное', [
    new Clear(),
    new RandomNumberCommand(),
  ])
  

  static getValues() {
    return [
      ...this.vkMsgCommand.value,
      ...this.gifMsgCommand.value,
      ...this.nsfwMsgCommand.value,
      ...this.utilsMsgCommand.value
    ]
  }
}