import { Message } from "discord.js";
import Command, { ICommand } from "../command";
import Discrod from 'discord.js'
import TenorService from "../../services/tenor.service";
import { UserModel } from "../../models/user";

const tenorService = new TenorService()

export default class SendRandomGifCommand extends Command implements ICommand {
  commandNames = ['gif', 'g'];
  description = 'Рандомная гифка';

  async run(msg: Message, args?: string[] | undefined) {
    const candidate = await UserModel.findOne({channelId: msg.guild?.id}).exec()
    const user = candidate ? candidate : this.createUserModel(msg)
    const tag = args?.length ? args[0] : undefined

    if (tag) {
      const gifUrls = await tenorService.randomGifs(tag, 1)
      this.sendMessage(msg, gifUrls[0])
    } else {
      if (!user.gifs.length || user.gifs.length <= 1) {
        user.gifs = await tenorService.randomGifs()
      }

      const randomGif = this.getRandomGif(user.gifs)
      user.gifs = user.gifs.filter(gif => gif !== randomGif)

      this.sendMessage(msg, randomGif)
      user.save()
    }

  };

  private sendMessage(msg: Discrod.Message, gifUrl: string) {
    if (!gifUrl) {
      this.sendDefaultMessage('Ничего не найдено! :(', this.errorColor, msg)
      return
    }
    
    const embed = new Discrod.MessageEmbed()
      .setColor(this.color)
      .setImage(gifUrl)
    
    msg.channel.send(embed)
  }

  private getRandomGif(gifUrls: string[]) {
    return gifUrls[Math.floor(Math.random() * gifUrls.length)];
  }
  
}