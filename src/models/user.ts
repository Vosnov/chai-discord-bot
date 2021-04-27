import * as mongoose from 'mongoose'
import {IMemeModel} from "./meme";
import {Model, Types} from "mongoose";
import {IVkGroupModel} from "./vkGroup";

export interface IUserModel extends mongoose.Document {
  queue: IMemeModel[]
  channelName: string
  channelId: string
  vkGroup: IVkGroupModel[]
  gifs: string[]
}

const schema = new mongoose.Schema<IUserModel>({
  queue: [{type: Types.ObjectId, ref: 'Meme'}],
  channelName: {type: String, required: true},
  channelId: {type: String, required: true, unique: true},
  vkGroup: [{type: Types.ObjectId, ref: 'VkGroup'}],
  gifs: [{type: String}]
}, {
  timestamps: true,
})

export const UserModel: Model<IUserModel> = mongoose.model('User', schema);
