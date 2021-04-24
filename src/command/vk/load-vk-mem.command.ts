import Discord from 'discord.js'
import {IUserModel, UserModel} from "../../models/user";
import {VkService} from "../../services/vk.service";
import {IMemeModel, MemeModel} from "../../models/meme";
import {IVkGroupModel, VkGroupModel} from "../../models/vkGroup";
import Command, { ICommand } from '../command';

export class LoadVkMemCommand extends Command implements ICommand {
  readonly MEME_LIMIT = 50

  commandNames = ['load', 'ld'];
  description = 'Загрузить мемы в очередь'

  offset: number = 0
  vkService = new VkService(2, 0)
  defaultDomains = [
    'peregovorov',
    'mdlso',
    'amoraliron',
    'mentaldisordeer',
    'amoralelite',
    'somka',
    'karkb'
  ]

  private async saveMemesToDb(ownerId: string, vkGroupIds?: number[]) {
    const domains = !vkGroupIds?.length ? this.defaultDomains : undefined
    const count = Math.ceil(this.MEME_LIMIT / (vkGroupIds ? vkGroupIds.length : this.defaultDomains.length))

    const memes = await this.vkService
      .setCount(count)
      .setOffset(this.offset)
      .getAllMemes(vkGroupIds, domains)

    const memeModels: IMemeModel[] = []
    memes.forEach(meme => {
      const memeModel = new MemeModel({...meme, ownerId})
      memeModels.push(memeModel)
      memeModel.save()
    })

    return memeModels
  }

  async run(msg: Discord.Message, args: string[] | undefined): Promise<void> {
    const candidate = await UserModel.findOne({channelId: msg.guild?.id}).exec()
    const user = candidate ? candidate : this.createUserModel(msg)

    await MemeModel.deleteMany({ownerId: user._id})
    const groups = await VkGroupModel.find({ownerId: user._id}).exec()

    const page = args?.length ? Number(args[0]) : 0
    this.offset = !!page ? page + this.MEME_LIMIT : 0

    if (!groups?.length) {
      await this.saveDefaultDomains(user)
    } else {
      await this.saveDomains(user, groups)
    }

    this.sendDefaultMessage(
      `Принимай фуру мемов! Загружено ${user.queue.length} мемов. Страница: ${page}`,
      this.color,
      msg
    )
  }

  private async saveDefaultDomains(user: IUserModel) {
    user.queue = await this.saveMemesToDb(user._id);
    await user.save()
  }

  private async saveDomains(user: IUserModel, groups: IVkGroupModel[]) {
    const groupIds = groups.map(group => group.groupId)
    user.queue = await this.saveMemesToDb(user._id, groupIds)
    await user.save()
  }

}