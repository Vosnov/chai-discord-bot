import { Message } from "discord.js";
import Command, { ICommand } from "../command";

export default class FindGifCommand extends Command implements ICommand {
  commandNames = ['findgif', 'findg', 'fg'];
  description = '';

  async run (msg: Message, args?: string[] | undefined) {
    
  }

}