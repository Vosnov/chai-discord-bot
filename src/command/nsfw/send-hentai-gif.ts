import { Message } from "discord.js";
import nekoClient from "../../neko";
import Command, { ICommand } from "../command"
import Discord from 'discord.js'

export default class SendHentaiGifCommand extends Command implements ICommand {
  commandNames = ['hentaigif', 'hgif', 'hg']
  description = 'Рандомная хентай гифка'
  nsfwContent = true

  async run (msg: Message, args?: string[] | undefined) {
    const hentaiGif = await nekoClient.nsfw.randomHentaiGif();

    const embed = new Discord.MessageEmbed()
      .setColor(this.color)
      .setImage(hentaiGif.url)
    
    msg.channel.send(embed)
  }
  
}