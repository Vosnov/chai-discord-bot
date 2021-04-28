import * as mongoose from "mongoose";
import {Model, Types} from "mongoose";
import {IUserModel} from "./user";

export interface IMeme {
  memeId: number
  ownerGroupId?: number
  urls: string[]
  text?: string
  date: number
}

export interface IMemeModel extends mongoose.Document, IMeme {
  ownerId: IUserModel
}

const schema = new mongoose.Schema<IMemeModel>({
  memeId: {type: Number, required: true},
  ownerId: {type: Types.ObjectId, ref: 'User', required: true},
  ownerGroupId: {type: Number, required: true},
  text: {type: String, required: false},
  date: {type: Number, required: true},
  urls: [{type: String, required: true}],
  expire_at: {type: Date, default: Date.now, expires: '60 days'}
}, {
  timestamps: true,
});

export const MemeModel: Model<IMemeModel> = mongoose.model('Meme', schema)

