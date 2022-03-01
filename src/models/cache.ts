import mongoose, {Model} from 'mongoose'

export type Cache = {
  channelId: string
  time: number
}

interface ICacheModel extends mongoose.Document, Cache {
  
} 

const schema = new mongoose.Schema<ICacheModel>({
  channelId: {type: String, required: true, unique: true},
  time: {type: Number, required: true},
})

export const CacheModel: Model<ICacheModel> = mongoose.model('Cache', schema)
