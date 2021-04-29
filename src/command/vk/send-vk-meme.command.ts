import Discord from 'discord.js'
import {IUserModel, UserModel} from "../../models/user";
import {IMeme, IMemeModel, MemeModel} from "../../models/meme";
import Command, { ICommand } from '../command';
import { VkService } from '../../services/vk.service';

export class SendVkMemeCommand extends Command implements ICommand {
  commandNames = ['meme', 'mem', 'm'];
  description = 'Отправить мем'

  vkService = new VkService()

  private getRandomMeme(memes: IMemeModel[] | undefined) {
    if (!memes) return undefined
    return memes[Math.floor(Math.random() * memes.length)]
  }

  async run(msg: Discord.Message): Promise<void> {
    const candidate = await UserModel.findOne({channelId: msg.guild?.id})
      .populate('vkGroup')
      .populate("queue")
      .exec()
    const user = candidate ? candidate : this.createUserModel(msg)

    if (!user.vkGroup.length && user.queue.length === 0) {
      const walls = await this.vkService.getDefaultGroupWalls()
      const memes: IMeme[] = []
      walls.forEach(wall => {
        if (wall) memes.push(...wall.memes)
      })
      user.queue = this.createMemeModels(memes, user)
    }

    if (user.queue.length <= 1) await this.loadMemes(user)

    const meme = this.getRandomMeme(user?.queue);
    if (meme) {
      this.sendMessage(meme, msg)

      user.queue = user?.queue.filter(qMeme => qMeme._id !== meme._id);
      meme.delete()
      user?.save()
    } else {
      this.sendDefaultMessage('Мемы закончились :( Попробуйте в другой раз', this.color, msg)
    }
  }

  private sendMessage(meme: IMemeModel, msg: Discord.Message) {
    if (meme.urls.length === 1) {
      const embed = new Discord.MessageEmbed()
        .setDescription(meme.text)
        .setImage(meme.urls[0])
        .setColor(this.color)
      
      msg.channel.send(embed)
    } else {
      msg.channel.send(meme?.text, {files: meme.urls})
    }
  }

  private async loadMemes(user: IUserModel) {
    const walls = await this.vkService.getAllMemes(user.vkGroup)
    const memes: IMeme[] = [] 
    walls.forEach(wall => {
      if (!wall) return

      memes.push(...wall.memes)

      const userGroup = user.vkGroup.find(group => group.groupId === wall.groupId)

      if (userGroup) {
        userGroup.postCount = wall.count
        userGroup?.save()
      }
    })

    user.queue = this.createMemeModels(memes, user);
  }

  private createMemeModels(memes: IMeme[], user: IUserModel) {
    const memeModels: IMemeModel[] = []
    memes.forEach(meme => {
      const memeModel = new MemeModel({...meme, ownerId: user._id})
      memeModels.push(memeModel)
      memeModel.save()
    })
    return memeModels
  }
}