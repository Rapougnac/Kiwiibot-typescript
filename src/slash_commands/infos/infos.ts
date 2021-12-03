import {
    Message,
    MessageEmbed,
    User,
    Role,
    CommandInteraction,
} from 'discord.js';
import SlashCommand from '../../struct/SlashCommand';
import type KiwiiClient from '../../struct/Client';

export default class InfosCommand extends SlashCommand {
    public constructor(public client: KiwiiClient) {
        super(client, {
            name: 'info',
            description: 'Get informations about a user, role or the server',
            commandOptions: [
                {
                    name: 'user',
                    description:
                        'Get informations about you, or the specified user',
                    type: 1,
                    options: [
                        {
                            name: 'target',
                            description: 'The user to display',
                            type: 6,
                        },
                    ],
                },
                {
                    name: 'server',
                    description: 'Get informations about the server',
                    type: 1,
                },
                {
                    name: 'role',
                    description: 'Get informations about the specified role',
                    type: 1,
                    options: [
                        {
                            name: 'role',
                            description: 'The role to display',
                            type: 8,
                            required: true,
                        },
                    ],
                },
            ],
        });
    }

    public override async execute(
        interaction: CommandInteraction,
        args: { user: User; role: Role }
    ) {
        console.log(args);
    }
}
