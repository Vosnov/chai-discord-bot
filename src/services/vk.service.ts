import axios from "axios";
import dotnev from "dotenv";
import {IMeme} from "../models/meme";
import {IGroup} from "../models/vkGroup";
dotnev.config()

interface IWall {
  response: {
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

export class VkService {
  baseURL = "https://api.vk.com/method/"
  count: number
  offset: number
  access: string;

  setCount(count = 2) {
    this.count = count
    return this;
  }

  setOffset(offset = 0) {
    this.offset = offset
    return this
  }

  constructor(count: number = 1, offset: number = 0) {
    const {VK_TOKEN, VK_VERSION} = process.env

    this.count = count
    this.offset = offset;
    this.access = `&access_token=${VK_TOKEN}&v=${VK_VERSION}`
  }

  public getAllMemes(groupIds?: number[], domains?: string[]) {
    if (!groupIds && !domains) {
      return new Promise<IMeme[]>(() => [])
    }

    let wallMemes: Promise<IMeme[] | undefined>[] = [];

    if (domains) wallMemes = domains.map(domain => this.wallMemes(undefined, domain))
    if (groupIds) wallMemes = groupIds.map(id => this.wallMemes(id))

    return Promise.all(wallMemes)
      .then((memes) => {
        const data: IMeme[] = []
        memes.forEach(meme => {
          if (meme) data.push(...meme)
        })
        return data
      })
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

  public wallMemes(id?: number, domain?: string) {
    const owner = id ? `&owner_id=-${id}` : ""
    const domainReq = domain ? `&domain=${domain}` : ""
    let options = `?count=${this.count}&offset=${this.offset}&filter=owner` + owner + domainReq

    const url = `${this.baseURL}/wall.get` + options + this.access
    const memes: IMeme[] = []

    return axios.get<IWall>(url).then(res => {
      if (res.data?.error?.error_msg) return

      res.data.response?.items?.forEach(item => {
        if (item?.copyright?.id) return
        if (item.is_pinned) return
        if (item.text.length > 1000) return;
        
        const images: string[] = this.takePhoto(item?.attachments || [])
        if (!images.length) return;

        const meme: IMeme = {
          memeId: item.id,
          ownerGroupId: item.owner_id,
          domain: domain || '',
          urls: images,
          date: item.date,
          text: item.text,
        }
        memes.push(meme)
      })

      return memes;
    })
  }

  public findGroup(link: string): Promise<IGroup | undefined> {
    const host = 'vk.com/'
    const id = link.includes(host) ? link.slice(link.indexOf(host) + host.length) : link
    const options = `?group_id=${id}`
    const url = `${this.baseURL}/groups.getById` + options + this.access

    return axios.get<IGroupDto>(url).then(data => {
      const response = data?.data?.response;
      if (response?.length) {
        const dto = response[0];
        if (!dto) return
        const group: IGroup = {
          groupId: dto?.id || -1,
          name: dto.name || '',
          domain: id
        }
        return group
      }
    })
  }

  public findGroups(links: string[]) {
    const ids: Promise<IGroup | undefined>[] = []
    links.forEach(link => {
      ids.push(this.findGroup(link))
    })

    return Promise.all(ids)
  }
}