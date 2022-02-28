import { Message } from "discord.js";
import Command, { Channel, ICommand } from "../command";
import Discrod from 'discord.js'
import TenorService from "../../services/tenor.service";
import { container } from "../../container";

const tenorService = new TenorService()

export default class SendRandomGifCommand extends Command implements ICommand {
  commandNames = ['gif', 'g'];
  description = 'Рандомная гифка';
  contaner = container

  async run(msg: Channel, args?: string[] | undefined) {
    const tag = args?.length ? args[0] : undefined

    if (tag) {
      const gifUrls = await tenorService.randomGifs(tag, 1)
        .catch(() => this.sendMessage(msg))
      if (!gifUrls) return
      this.sendMessage(msg, gifUrls[0])
    } else {
      const gifs = this.contaner.getGifs()
      if (gifs.length <= 1) {
        this.contaner.setGifs(await tenorService.randomGifs())
      }

      const randomGif = this.contaner.getRandomGif()
      this.contaner.setGifs(gifs.filter(gif => gif !== randomGif))

      this.sendMessage(msg, randomGif)
    }

  };

  private sendMessage(msg: Channel, gifUrl?: string) {
    if (!gifUrl) {
      this.sendDefaultMessage('Ничего не найдено! :(', this.errorColor, msg)
      return
    }
    
    const embed = new Discrod.MessageEmbed()
      .setColor(this.color)
      .setImage(gifUrl)
    
    msg.send(embed)
  }
  
}