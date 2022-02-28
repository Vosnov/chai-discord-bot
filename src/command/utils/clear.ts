import Discord from "discord.js"
import Command, { Channel, ICommand } from "../command";

export class Clear extends Command implements ICommand {
  commandNames: string[] = ['clear', 'clr'];
  description = "Очистка сообщений"
  onlyManageGuild = true

  async run(msg: Channel, args?: string[]): Promise<void> {
    if (!args?.length || !Number(args[0])) {
      this.sendDefaultMessage('Укажите количество сообщений для удаления!', this.color, msg)
      return
    }

    let limit = Number(args[0])
    if (limit > 100 || limit <= 0) limit = 100 

    const messages = await msg.messages.fetch({limit})
    if (msg instanceof Discord.TextChannel) {
      msg.bulkDelete(messages, true)
    }
  }

}