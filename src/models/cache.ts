import path from "path";

export type Cache = {
  channelId: string
  time: number
}

const root = path.resolve(__dirname, '..');
export const cacheFile = `${root}/cache/cahce.json`
export const cacheDir = `${root}`