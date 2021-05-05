import Discord from "discord.js"
import Command, { ICommand } from "./command";

export class Clear extends Command implements ICommand {
  commandNames: string[] = ['clear', 'clr'];
  description = "Очистка сообщений"

  async run(msg: Discord.Message, args?: string[]): Promise<void> {
    if (!msg.guild?.me?.hasPermission('MANAGE_MESSAGES')) {
      this.missPermissionsMessage(msg)
      return
    }

    if (!args?.length || !Number(args[0])) {
      this.sendDefaultMessage('Укажите количество сообщений для удаления!', this.color, msg)
      return
    }

    let limit = Number(args[0])
    if (limit > 100 || limit <= 0) limit = 100 

    const messages = await msg.channel.messages.fetch({limit})
    if (msg.channel instanceof Discord.TextChannel) {
      msg.channel.bulkDelete(messages, true)
    }
  }

}