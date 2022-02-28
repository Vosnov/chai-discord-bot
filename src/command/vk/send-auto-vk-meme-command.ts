import Discord, {Message} from "discord.js";
import Command, { ICommand, Channel } from "../command";
import { SendVkMemeCommand } from "./send-vk-meme.command";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import { Cache, cacheDir, cacheFile } from "../../models/cache";
import { existsSync } from "fs";

export class SendAutoVkMemeCommand extends Command implements ICommand {
  commandNames = ['automeme', 'am']
  description = 'Автоматическая рассылка мемов'
  interval?: NodeJS.Timeout
  resetComand = 'reset'
  memeCommand = new SendVkMemeCommand()
  onlyManageGuild = true
  
  async runOnStart(msg: Channel) {
    const cache = await this.readCache()
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
      this.clearCache()
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
      this.setCache(msg.id, time)
      return
    }

    this.sendDefaultMessage('Упс! Что-то пошло не так', this.color, msg)
  } 
  
  clearCache() {
    unlink(cacheFile)
  }

  async setCache(channelId: string, time: number) {
    if (!existsSync(cacheDir)){
      await mkdir(cacheDir);
    }

    const cache: Cache = {
      channelId,
      time,
    }
    const json = JSON.stringify(cache)
    writeFile(cacheFile, json)
  }

  async readCache() {
    try {
      const file = await readFile(cacheFile, 'utf8')
      return JSON.parse(file) as Cache
    } catch {
      console.log('No cache')
    }
  }
}