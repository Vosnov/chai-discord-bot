import axios from "axios"
import { RandomNumberCommand } from "../command/random-number-command"

interface TenorDto {
  results: Result[]
}

interface Media {
  gif: {
    url: string
  }
}

interface Result {
  url: string
  id: string
  media: Media[]
}

export default class TenorService {
  baseURL = 'https://g.tenor.com/v1/'
  key = `key=${process.env.TENOR_KEY}&`

  async randomGif(searchValue = 'meme') {
    const valueUrl = `q=${searchValue}&`
    const limit = `limit=1&`
    const filter = `media_filter=minimal&`
    const pos = `pos=${this.randomPos()}&`
    const url = this.baseURL + 'random?' + this.key + valueUrl + limit + filter + pos

    const res = await axios.get<TenorDto>(url)
    const gif =  res.data?.results[0].media[0].gif
    return gif
  }

  private randomPos() {
    return RandomNumberCommand.randomInteger(0, 1000);
  }
}