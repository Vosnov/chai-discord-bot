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
  filters = '&media_filter=minimal&'

  async randomGifs(searchValue = 'meme', limit = 20) {
    const valueUrl = `q=${searchValue}&`
    const limitUrl = `limit=${limit}&`
    const url = this.baseURL + 'random?' + this.key + valueUrl + this.filters + limitUrl
    
    const gifUrls = await this.getGifUrls(url)
    return gifUrls
  }

  private async getGifUrls(url: string) {
    const res = await axios.get<TenorDto>(url)
    return res.data.results.map(res => res.media[0].gif.url)
  }
}