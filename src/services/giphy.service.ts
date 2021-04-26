import axios from "axios";

interface IGif {
  type: 'gif' | string
  id: string
  url: string
  image_url?: string
  bitly_url?: string
  bitly_gif_url?: string
}

interface IGiphyDto {
  data?: IGif
}

export default class GiphyService {
  baseURL = 'https://api.giphy.com/v1/gifs/'
  key = `api_key=${process.env.GIPHY_KEY}&`

  async findGif(searchValue: string) {
    const limit = `limit=1&`
    const searchValueUrl = `q=${searchValue}&`
    const url = this.baseURL + 'search?' + this.key + limit + searchValueUrl

    const res = await axios.get<IGiphyDto>(url)
    return res.data.data
  }

  async randomGif(tag = 'meme') {
    const tagUrl = `tag=${tag}&`
    const url = this.baseURL + 'random?' + this.key + tagUrl
    
    const res = await axios.get<IGiphyDto>(url)
    
    if (!res.data.data?.id) return undefined
    return res.data.data
  }
}