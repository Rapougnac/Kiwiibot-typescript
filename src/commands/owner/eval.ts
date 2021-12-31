import { clean } from '../../util/string';
import { inspect } from 'util';
import type { Message } from 'discord.js';
import { Formatters, Util } from 'discord.js';

import Command from '../../struct/Command';
import type Client from '../../struct/Client';
export default class EvalCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'eval',
      aliases: ['evl'],
      description: 'Execute some javascript code',
      category: 'owner',
      ownerOnly: true,
      cooldown: 5,
      utilisation: '{prefix}eval [code]',
      img: 'https://cdn-icons-png.flaticon.com/512/993/993855.png',
    });
  }
  public override async execute(
    _client: Client,
    message: Message,
    args: string[]
  ) {
    try {
      const code = args.join(' ');
      let result = eval(code);
      if (typeof result !== 'string') result = inspect(result);
      result = clean(result);
      if (result.length >= 2000) result = Util.splitMessage(result);
      if (Array.isArray(result)) {
        for (let res of result) {
          res = Formatters.codeBlock('js', `${res}\n`);
          return message.channel.send(res);
        }
      } else return message.channel.send(`\`\`\`js\n${result}\n\`\`\``);
    } catch (e: unknown) {
      await message.channel.send(
        `\`ERROR\` \`\`\`xl\n${clean(e as string)}\n\`\`\``
      );
    }
  }
}
