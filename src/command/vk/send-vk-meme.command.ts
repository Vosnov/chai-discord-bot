import Discord from 'discord.js'
import {IMeme} from "../../models/meme";
import Command, { Channel, ICommand } from '../command';
import { VkService } from '../../services/vk.service';
import { container } from '../../container';

export class SendVkMemeCommand extends Command implements ICommand {
  commandNames = ['meme', 'mem', 'm'];
  description = 'Отправить мем'

  vkService = new VkService()
  container = container

  async run(msg: Channel): Promise<void> {
    const memes = this.container.getMemes()

    if (!this.container.getGroups().length && memes.length <= 0) await this.loadDefaultMemes()
    if (this.container.getMemes().length <= 0) await this.loadMemes()

    const meme = this.container.getRandomMeme();
    if (meme) {
      this.sendMessage(meme, msg)
      this.container.getMemes().filter(mem => mem.memeId !== meme.memeId)
    } else {
      this.sendDefaultMessage('Мемы закончились :( Попробуйте в другой раз', this.color, msg)
    }
  }

  private sendMessage(meme: IMeme, msg: Channel) {
    if (meme.urls.length === 1) {
      const embed = new Discord.MessageEmbed()
        .setDescription(meme.text)
        .setImage(meme.urls[0])
        .setColor(this.color)
      
      msg.send(embed)
    } else {
      msg.send(meme?.text, {files: meme.urls})
    }
  }

  private async loadDefaultMemes() {
    const walls = await this.vkService.getDefaultGroupWalls()
    const memes: IMeme[] = []
    walls.forEach(wall => {
      if (wall) memes.push(...wall.memes)
    })

    this.container.setMemes(memes)
  }

  private async loadMemes() {
    const groups = this.container.getGroups()
    const walls = await this.vkService.getAllMemes(groups)
    const memes: IMeme[] = [] 
    walls.forEach(wall => {
      if (!wall) return

      memes.push(...wall.memes)

      const userGroup = groups.find(group => group.groupId === wall.groupId)

      if (userGroup) {
        userGroup.postCount = wall.count
      }
    })

    this.container.setMemes(memes);
  }
}