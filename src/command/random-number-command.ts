import Discord from 'discord.js'
import Command, { ICommand } from './command';

export class RandomNumberCommand extends Command implements ICommand {
  commandNames: string[] = ['random', 'rnd'];
  description = 'Случайное число'

  public static randomInteger(min: number, max: number) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  async run(msg: Discord.Message, args?: string[]): Promise<void> {
    if (!args || args.length < 2) {
      this.sendDefaultMessage(
        `Укажите диапазон значений. Пример: ${this.commandNames[0]} 0 10`,
        this.color,
        msg
      )
      return
    }

    const min = Number(args[0])
    const max = Number(args[1])

    if (min >= max) {
      this.sendDefaultMessage('Минимум не может быть больше максимума!', this.errorColor, msg)
      return
    }

    const randomNumber = RandomNumberCommand.randomInteger(min, max)
    const embed = new Discord.MessageEmbed()
      .setTitle(randomNumber)
      .setColor(this.color)
    msg.channel.send(embed)
  }

}