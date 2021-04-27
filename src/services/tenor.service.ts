import axios from "axios"

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
  baseURL = 'https://api.tenor.com/v1/'
  key = `key=${process.env.TENOR_KEY}&`
  filters = `limit=1&media_filter=minimal&`

  async randomGif(searchValue = 'meme') {
    const valueUrl = `q=${searchValue}&`
    const url = this.baseURL + 'random?' + this.key + valueUrl + this.filters
    
    console.log(url)
    const gif = await this.getGif(url)
    return gif
  }

  private async getGif(url: string) {
    const res = await axios.get<TenorDto>(url)
    console.log(res.data)
    const gif =  res.data?.results[0].media[0].gif
    return gif
  }
}