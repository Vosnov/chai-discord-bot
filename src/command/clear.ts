import Discord from "discord.js"
import Command, { ICommand } from "./command";

export class Clear extends Command implements ICommand {
  commandNames: string[] = ['clear', 'clr'];
  description = "Очистка сообщений от бота"

  async run(msg: Discord.Message): Promise<void> {
    msg.channel.messages.fetch({limit: 50}).then(messages => {
      const botMessages = messages.filter(msg => msg.author.bot)
      if (msg.channel instanceof Discord.TextChannel) {
        msg.channel.bulkDelete(botMessages)
      }
    })
  }

}