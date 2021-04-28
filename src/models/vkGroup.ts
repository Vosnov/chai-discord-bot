import * as mongoose from 'mongoose'
import {IUserModel} from "./user";
import {Model, Types} from "mongoose";

export interface IGroup {
  groupId: number
  name: string
  postCount?: number
}

export interface IVkGroupModel extends mongoose.Document, IGroup {
  ownerId: IUserModel,
}

const schema = new mongoose.Schema<IVkGroupModel>({
  ownerId: {type: Types.ObjectId, ref: 'User', required: true},
  groupId: {type: Number, required: true},
  name: {type: String, default: ''},
  postCount: {type: Number, required: false}
})

export const VkGroupModel: Model<IVkGroupModel> = mongoose.model('VkGroup', schema)