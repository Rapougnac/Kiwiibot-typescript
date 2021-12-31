import Command from '../../../struct/Command';
import type KiwiiClient from '../../../struct/Client';
import type { Message } from 'discord.js';

export default class LoadCommand extends Command {
  constructor(client: KiwiiClient) {
    super(client, {
      name: 'load',
      aliases: ['lo'],
      description: 'Load a command',
      category: 'owner',
      utilisation: '{prefix}load [commandName]',
      ownerOnly: true,
    });
  }
  public override async execute(
    _client: KiwiiClient,
    message: Message,
    [commandName]: string[]
  ) {
    if (!commandName)
      return message.reply('Please provide a command name to load');
    await super.load(commandName);
    return message.reply(`Command \`${commandName}\` has been loaded`);
  }
}
