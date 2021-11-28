import Command from '../../../struct/Command';
import KiwiiClient from '../../../struct/Client';
import { Message } from 'discord.js';

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
    public override async execute(_client: KiwiiClient, message: Message, [commandName]: string[]) {
        if(!commandName) 
            return message.reply('Please provide a command name to load');
        void super.load(commandName);
        return message.reply(`Command \`${commandName}\` has been loaded`);
    }
}
