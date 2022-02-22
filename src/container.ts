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

  setGroups(groups: IGroup[]) {
    this.groups = groups
  }

  getGroups() {
    return this.groups
  }
}