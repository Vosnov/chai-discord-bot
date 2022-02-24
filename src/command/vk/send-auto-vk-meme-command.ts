import Discord, {Message} from "discord.js";
import Command, { ICommand } from "../command";
import { SendVkMemeCommand } from "./send-vk-meme.command";

export class SendAutoVkMemeCommand extends Command implements ICommand {
  commandNames = ['automeme', 'am']
  description = 'Автоматическая рассылка мемов'
  interval?: NodeJS.Timeout
  resetComand = 'reset'
  memeCommand = new SendVkMemeCommand()
  onlyManageGuild = true;

  async run(msg: Message, args?: string[] | undefined) {
    if (!args?.length) {
      const embed = new Discord.MessageEmbed()
        .setTitle('Установка или сброс рассылки')
        .setColor(this.color)
        .setDescription(`Сброс: \`${this.resetComand}\`. Установка интервала в минутах, пример: \`30m\``)

      msg.channel.send(embed)
      return
    }

    if (args[0] === this.resetComand) {
      if (!this.interval) return
      clearInterval(this.interval)
      this.sendDefaultMessage('Рассылка сброшена!', this.color, msg)
      return
    }

    if (args[0].includes('m')) {
      let time = parseInt(args[0])
      
      if (time <= 0) time = 1

      if (this.interval) clearInterval(this.interval)

      this.interval = setInterval(() => {
        this.memeCommand.run(msg)
      }, 1000 * 60 * time)

      this.sendDefaultMessage('Рассылка установлена!', this.color, msg)
      return
    }

    this.sendDefaultMessage('Упс! Что-то пошло не так', this.color, msg)
  } 
}