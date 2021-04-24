import Discord from 'discord.js'
import {UserModel} from "../../models/user";
import {IMemeModel} from "../../models/meme";
import Command, { ICommand } from '../command';

export class SendVkMemeCommand extends Command implements ICommand {
  commandNames = ['meme', 'mem', 'm'];
  description = 'Отправить мем'

  private getRandomMeme(memes: IMemeModel[] | undefined) {
    if (!memes) return undefined
    return memes[Math.floor(Math.random() * memes.length)]
  }

  async run(msg: Discord.Message): Promise<void> {
    const candidate = await UserModel.findOne({channelId: msg.guild?.id})
      .populate("queue")
      .exec()
    const user = candidate ? candidate : this.createUserModel(msg)

    if (!user.queue.length) {
      this.sendDefaultMessage(
        'Мемов нет :( Используйте `load` [page] для загрузки мемов.' +
        ' Где [page] номер страници. По умолчанию page = 0.',
        this.color,
        msg
      )
    }

    const meme = this.getRandomMeme(user?.queue);
    if (meme) {
      msg.channel.send(meme?.text, {files: meme.urls})

      user.queue = user?.queue.filter(qMeme => qMeme._id !== meme._id);
      meme.delete()
      user?.save()
    }
  }

}