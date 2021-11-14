import { clean } from '../../util/string';
import { inspect } from 'util';
import { Message, Formatters, Util } from 'discord.js';

import Command from '../../struct/Command';
import Client from '../../struct/Client';
export default class EvalCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'eval',
            aliases: ['evl'],
            description: 'Execute some javascript code',
            category: 'owner',
            cooldown: 5,
            utilisation: '{prefix}eval [code]',
            ownerOnly: true,
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
            let result: string | string[] = eval(code);
            if (typeof result !== 'string') result = inspect(result);
            result = clean(result);
            if (result.length >= 2000) result = Util.splitMessage(result);
            if (Array.isArray(result)) {
                for (let res of result) {
                    res = Formatters.codeBlock('js', res + '\n');
                    return message.channel.send(res);
                }
            } else return message.channel.send(result);
        } catch (e: any) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(e)}\n\`\`\``);
        }
    }
}
