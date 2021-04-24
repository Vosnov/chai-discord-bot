import * as mongoose from 'mongoose'
import {IUserModel} from "./user";
import {Model, Types} from "mongoose";

export interface IGroup {
  groupId: number
  domain: string,
  name: string
}

export interface IVkGroupModel extends mongoose.Document, IGroup {
  ownerId: IUserModel,
}

const schema = new mongoose.Schema<IVkGroupModel>({
  ownerId: {type: Types.ObjectId, ref: 'User', required: true},
  groupId: {type: Number, required: true},
  domain: {type: String},
  name: {type: String}
})

export const VkGroupModel: Model<IVkGroupModel> = mongoose.model('VkGroup', schema)