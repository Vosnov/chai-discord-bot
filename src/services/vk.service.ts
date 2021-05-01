import axios from "axios";
import dotnev from "dotenv";
import { RandomNumberCommand } from "../command/random-number-command";
import {IMeme} from "../models/meme";
import {IGroup, IVkGroupModel} from "../models/vkGroup";
dotnev.config()

interface IWallDto {
  response?: {
    count: number,
    items?: IWallItem[]
  }

  error: {
    error_msg: string
  }
}

interface IWallItem {
  owner_id: number,
  text: string,
  post_type: string
  id: number,
  attachments?: IAttachment[]
  date: number
  is_pinned?: number
  copyright?: {
    id: number
  }
}

interface IAttachment {
  type: string
  photo?: {
    id: number
    sizes?: ISize[]
  }
}

interface ISize {
  height: number,
  url: string,
  type: string
  width: number
}

interface IGroupDto {
  response?: {
    id?: number
    name?: string
    screen_name?: string
  }[]
}

interface IWall {
  groupId: number
  count: number
  memes: IMeme[]
}

export class VkService {
  readonly MEME_LIMIT = 50
  baseURL = "https://api.vk.com/method/"
  access: string;

  constructor() {
    const {VK_TOKEN, VK_VERSION} = process.env

    this.access = `&access_token=${VK_TOKEN}&v=${VK_VERSION}`
  }

  public async getAllMemes(groupModels: IVkGroupModel[]) {
    if (!groupModels.length) return []

    const count = Math.ceil(this.MEME_LIMIT / groupModels.length)
    const wallMemes = groupModels.map(group => this.wallMemes(group.groupId, group.postCount, count));
    return await Promise.all(wallMemes)
  }

  private maxSizePhoto(sizes: ISize[]): ISize | undefined {
    const sortSizes = sizes.sort((a, b) => b.width - a.width)
    return sortSizes[0]
  }

  private mediumSizePhoto(sizes: ISize[]): ISize | undefined {
    const sortSizes = sizes.sort((a, b) => a.width - b.width)
    return sortSizes[sortSizes.length - Math.floor(sortSizes.length / 2) - 1]
  }

  private takePhoto(attachments: IAttachment[]) {
    const images: string[] = []
    attachments?.forEach(att => {
      const sizes = att.photo?.sizes;
      if (!sizes) return

      if (attachments.length >= 3) {
        const photo = this.mediumSizePhoto(sizes)
        if (photo) images.push(photo.url)
      } else {
        const photo = this.maxSizePhoto(sizes)
        if (photo) images.push(photo.url)
      }
    })

    return images
  }

  public async wallMemes(id: number, postCount = 100, count = 10): Promise<IWall | undefined> {
    const owner = id ? `&owner_id=-${id}` : ""
    let offset = RandomNumberCommand.randomInteger(0, postCount)
    
    if (offset - count > 0) offset -= count

    let options = `?count=${count}&offset=${offset}&filter=owner` + owner

    const url = `${this.baseURL}/wall.get` + options + this.access
    const memes: IMeme[] = []

    const res = await axios.get<IWallDto>(url)

    if (!res.data.response?.items?.length) return

    res.data.response?.items?.forEach(item => {
      if (item?.copyright?.id) return
      if (item.is_pinned) return
      if (item.text.length > 500) return

      // ad filter
      if (item.text.includes("vk.com")) return
      
      const images: string[] = this.takePhoto(item?.attachments || [])
      if (!images.length) return

      const meme: IMeme = {
        memeId: item.id,
        ownerGroupId: item.owner_id,
        urls: images,
        date: item.date,
        text: item.text,
      }
      memes.push(meme)
    })
    
    return {
      count: res.data.response.count,
      memes,
      groupId: id
    }
  }

  public async findGroups(links: string[]) {
    const options = `?group_ids=${links.join(',')}`
    const url = `${this.baseURL}/groups.getById` + options + this.access

    const groupDto = await axios.get<IGroupDto>(url)
    const groups = groupDto.data.response?.map(res => {
      const group: IGroup = {
        groupId: res.id || -1,
        name: res.name || '',
      }
      return group;
    }) || []

    return groups
  }

  public async getDefaultGroupWalls() {
    const groups = [
      {id: 187263168, count: 4600}, // achexd
      {id: 12353330, count: 40000}, // peregovorov
      {id: 158619277, count: 900}, // mdlso
      {id: 158815806, count: 2600}, // amoraliron
      {id: 154168174, count: 17000}, // mentaldisordeer
      {id: 142574308, count: 14000}, // somka
      {id: 155464693, count: 31000} // karkb
    ]

    const walls = groups.map(group => this.wallMemes(group.id, group.count, 7))
    return Promise.all(walls)
  }
}