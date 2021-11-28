import Command from '../../../struct/Command';
import KiwiiClient from '../../../struct/Client';
import { Message } from 'discord.js';

export default class ReloadCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'reload',
            aliases: ['rel'],
            description: 'Reload the specified command',
            category: 'owner',
            utilisation: '{prefix}reload [commandName]',
        });
    }
    public override async execute(_client: KiwiiClient, message: Message, [commandName]: string[]) {
        if(!commandName) 
            return message.reply('Please specify a command to reload');
        void await super.reload(commandName);
        return message.reply(`Successfully reloaded the ${commandName} command`);
    }
}
