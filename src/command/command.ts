import Discord from "discord.js";

export type Channel = Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel

export interface ICommand {
  commandNames: string[]
  description: string
  onlyManageGuild?: boolean
  nsfwContent?: boolean
  runOnStart?: (msg: Channel) => Promise<void>
  run: (msg: Channel, args?: string[]) => Promise<void>
}

export default class Command {
  color = '#0099ff'
  errorColor = '#FF9494'

  protected sendDefaultMessage(description: string, color: string, msg: Channel) {
    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(description)

    msg.send(embed)
  }

  protected missPermissionsMessage(msg: Discord.Message) {
    this.sendDefaultMessage('Эй! У меня нет прав для этой команды!', this.errorColor, msg.channel)
  }
}