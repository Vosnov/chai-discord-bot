import { Message } from "discord.js";
import GiphyService from "../../services/giphy.service";
import Command, { ICommand } from "../command";
import Discrod from 'discord.js'

const giphyService = new GiphyService();

export class SendRandomGifCommand extends Command implements ICommand {
  commandNames = ['gif', 'g'];
  description = 'Рандомная гифка';

  async run(msg: Message, args?: string[] | undefined) {
    const tag = args?.length ? args[0] : undefined
    const gif = await giphyService.randomGif(tag)

    if (gif.image_url) {
      const embed = new Discrod.MessageEmbed()
        .setColor(this.color)
        .setImage(gif.image_url)

      msg.channel.send(embed)
    } else {
      msg.channel.send(gif.bitly_gif_url || gif.url)
    }
  };
  
}