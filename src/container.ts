import { IMeme } from "./models/meme";
import { IGroup } from "./models/vkGroup";

export class Container {
  memes: IMeme[]
  groups: IGroup[]

  constructor() {
    this.memes = []
    this.groups = []
  }

  setMemes(memes: IMeme[]) {
    this.memes = memes
  }

  getMemes() {
    return this.memes
  }

 getRandomMeme() {
    if (!this.memes) return undefined
    const meme = this.memes[Math.floor(Math.random() * this.memes.length)]
    this.memes = this.memes.filter(m => m.memeId !== meme.memeId)
    return meme
  }

  setGroups(groups: IGroup[]) {
    this.groups = groups
  }

  getGroups() {
    return this.groups
  }
}