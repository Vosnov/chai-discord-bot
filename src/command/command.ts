import Discord from "discord.js";
import {UserModel} from "../models/user";

export interface ICommand {
  commandNames: string[]
  description: string
  onlyManageGuild?: boolean
  run: (msg: Discord.Message, args?: string[]) => Promise<void>
}

export default class Command {
  color = '#0099ff'
  errorColor = '#FF9494'

  protected createUserModel(msg: Discord.Message) {
    return new UserModel({
      channelName: msg.guild?.name,
      channelId: msg.guild?.id,
    })
  }

  protected sendDefaultMessage(description: string, color: string, msg: Discord.Message) {
    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(description)

    msg.channel.send(embed)
  }

  protected missPermissionsMessage(msg: Discord.Message) {
    this.sendDefaultMessage('Эй! У меня нет прав для этой команды!', this.errorColor, msg)
  }
}