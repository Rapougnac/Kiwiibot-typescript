import Command from '../../../struct/Command';
import KiwiiClient from '../../../struct/Client';
import { Message } from 'discord.js';

export default class UnloadCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'unload',
            aliases: ['ul'],
            description: 'Unload the specified command',
            category: 'owner',
            utilisation: '{prefix}unload [commandName]',
        });
    }
    public override async execute(
        client: KiwiiClient,
        message: Message,
        [commandName]: string[]
    ) {
        if (!commandName)
            return message.reply('Please specify a command to unload');
        if (!(client.aliases.has(commandName) || client.commands.has(commandName)))
            return message.reply('That command does not exist');
        const command =
            client.commands.get(commandName) || client.aliases.get(commandName);
        if (!command) return message.reply('That command does not exist');
        commandName = command.help.name;
        void super.unload(commandName);
        return message.reply(
            `Successfully unloaded the ${commandName} command`
        );
    }
}
