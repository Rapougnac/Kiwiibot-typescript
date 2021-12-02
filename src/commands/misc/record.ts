import Command from '../../struct/Command';
import KiwiiClient from '../../struct/Client';
import { Message } from 'discord.js';


export default class RecordCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'record',
            aliases: ['rec'],
            description: "Record your voice and friend's voice",
            category: 'misc',
            utilisation: '{prefix}record',
        });
    }
    public override async execute(
        client: KiwiiClient,
        message: Message,
        args: string[]
    ) {
        
    }
}
