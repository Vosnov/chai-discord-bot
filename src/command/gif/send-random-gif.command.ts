import { Message } from "discord.js";
import Command, { ICommand } from "../command";
import Discrod from 'discord.js'
import TenorService from "../../services/tenor.service";

const tenorService = new TenorService()

export default class SendRandomGifCommand extends Command implements ICommand {
  commandNames = ['gif', 'g'];
  description = 'Рандомная гифка';

  async run(msg: Message, args?: string[] | undefined) {
    const tag = args?.length ? args[0] : undefined
    const gif = await tenorService.randomGif(tag)

    if (!gif) {
      this.sendDefaultMessage('Ничего не найдено! :(', this.errorColor, msg)
      return
    }
    
    const embed = new Discrod.MessageEmbed()
      .setColor(this.color)
      .setImage(gif.url)
    
    msg.channel.send(embed)
  };
  
}