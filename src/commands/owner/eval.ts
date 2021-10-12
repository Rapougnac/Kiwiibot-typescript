import { clean } from '../../util/string';
import { inspect } from 'util';
import { Message, MessageEmbed, MessageAttachment } from 'discord.js';

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
        });
    }
    async execute(client: Client, message: Message, args: string[]) {
        try {
            const code = args.join(' ');
            let result = eval(code);
            if (typeof result !== 'string') result = inspect(result);
            message.channel.send(clean(result), { code: 'js', split: true });
        } catch (e: any) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(e)}\n\`\`\``);
        }
    }
};
