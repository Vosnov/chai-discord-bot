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
    if (!args) return

    const min = args[0]
    const max = args[1]

    if (!min && !max) return;

    const randomNumber = RandomNumberCommand.randomInteger(Number(min), Number(max))
    const embed = new Discord.MessageEmbed()
      .setTitle(randomNumber)
      .setImage('https://cs9.pikabu.ru/post_img/2017/08/15/9/og_og_1502807270212370812.jpg')
      .setColor(this.color)
    msg.channel.send(embed)
  }

}