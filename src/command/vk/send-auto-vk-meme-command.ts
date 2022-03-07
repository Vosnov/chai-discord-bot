import Discord from "discord.js";
import Command, { ICommand, Channel } from "../command";
import { SendVkMemeCommand } from "./send-vk-meme.command";
import { CacheModel } from "../../models/cache";

export class SendAutoVkMemeCommand extends Command implements ICommand {
  commandNames = ['automeme', 'am']
  description = 'Автоматическая рассылка мемов'
  interval?: NodeJS.Timeout
  resetComand = 'reset'
  memeCommand = new SendVkMemeCommand()
  onlyManageGuild = true

  reg = new RegExp(/[0-9]{2,3}['m']/g)
  
  async runOnStart(msg: Channel) {
    const cache = await this.readCache(msg.id)
    if (!cache) return

    this.interval = setInterval(() => {
      this.memeCommand.run(msg)
    }, 1000 * 60 * cache.time)
    this.sendDefaultMessage('Рассылка установлена!', this.color, msg)
  }

  async run(msg: Channel, args?: string[] | undefined) {
    if (!args?.length) {
      const embed = new Discord.MessageEmbed()
        .setTitle('Установка или сброс рассылки')
        .setColor(this.color)
        .setDescription(`Сброс: \`${this.resetComand}\`. Установка интервала в минутах, пример: \`30m\``)

      msg.send(embed)
      return
    }

    if (args[0] === this.resetComand) {
      if (!this.interval) return
      clearInterval(this.interval)
      this.sendDefaultMessage('Рассылка сброшена!', this.color, msg)
      this.clearCache(msg.id)
      return
    }

    if (args[0].match(this.reg)) {
      let time = parseInt(args[0])
      
      if (time <= 0) time = 1

      if (this.interval) clearInterval(this.interval)

      this.interval = setInterval(() => {
        this.memeCommand.run(msg)
      }, 1000 * 60 * time)

      this.sendDefaultMessage('Рассылка установлена!', this.color, msg)
      this.setCache(msg.id, time)
      return
    }

    this.sendDefaultMessage('Упс! Что-то пошло не так', this.color, msg)
  } 
  
  async clearCache(channelId: string) {
    await CacheModel.findOneAndDelete({channelId})
  }

  async setCache(channelId: string, time: number) {
    const cacheModel = await CacheModel.findOne({channelId})

    if (cacheModel) {
      cacheModel.channelId = channelId
      cacheModel.time = time
      await cacheModel.save()
      return
    }

    new CacheModel({channelId, time}).save()
  }

  async readCache(channelId: string) {
    return CacheModel.findOne({channelId})
  }
}