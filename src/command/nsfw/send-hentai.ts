import { Message } from "discord.js";
import nekoClient from "../../neko";
import Command, { ICommand } from "../command"
import Discord from 'discord.js'

export enum EHentai {
  pussy = 'pussy',
  cum = 'cum',
  anal = 'anal',
  blowJob = 'blowjob',
  futa = 'futa',
  neko = 'neko',
  tits = 'tits',
  boobs = 'boobs',
  lesbian = 'lesbian',
}

export default class SendHentaiCommand extends Command implements ICommand {
  commandNames = ['hentai']
  description = 'Рандомный хентай. Возможен поиск по ключевым словам: ' + this.getTags().join(', ')
  nsfwContent = true

  getTags() {
    const tags: string[] = []

    for(const tag in EHentai) {
      tags.push(tag)
    }

    return tags
  }

  async run (msg: Message, args?: string[] | undefined) {
    if (!args?.length) {
      this.sendHentaiMessage(msg)
      return
    }

    switch (args[0] as EHentai) {
      case EHentai.anal:
        const anal = await nekoClient.nsfw.anal()
        this.sendMessage(anal.url, msg)
        break
      case EHentai.blowJob: 
        const blowJob = await nekoClient.nsfw.blowJob()
        this.sendMessage(blowJob.url, msg)
        break
      case EHentai.boobs:
        const boobs = await nekoClient.nsfw.boobs()
        this.sendMessage(boobs.url, msg)
        break
      case EHentai.cum:
        const cum = await nekoClient.nsfw.cumArts()
        this.sendMessage(cum.url, msg)
        break
      case EHentai.lesbian:
        const lesbian = await nekoClient.nsfw.lesbian()
        this.sendMessage(lesbian.url, msg)
        break
      case EHentai.neko:
        const neko = await nekoClient.nsfw.neko()
        this.sendMessage(neko.url, msg)
        break
      case EHentai.pussy:
        const pussy = await nekoClient.nsfw.pussy()
        this.sendMessage(pussy.url, msg)
        break
      case EHentai.tits:
        const tits = await nekoClient.nsfw.tits()
        this.sendMessage(tits.url, msg)
        break
      case EHentai.futa:
        const futa = await nekoClient.nsfw.futanari()
        this.sendMessage(futa.url, msg)
        break
      default:
        this.sendHentaiMessage(msg)
    }
  }

  private sendMessage(imageUrl: string, msg: Discord.Message) {
    const embed = new Discord.MessageEmbed()
    .setColor(this.color)
    .setImage(imageUrl)
  
    msg.channel.send(embed)
  }

  private async sendHentaiMessage(msg: Discord.Message) {
    const hentai = await nekoClient.nsfw.hentai();
    this.sendMessage(hentai.url, msg)
  }
  
}