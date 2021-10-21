import { Message, MessageEmbed, MessageAttachment, User } from 'discord.js';
import CommandInteraction from '../../struct/Interactions/CommandInteraction';
import SlashCommand from '../../struct/SlashCommand';
import Client from '../../struct/Client';
import axios from 'axios';
import { stripIndent } from 'common-tags';
export default class DocsSlashCommand extends SlashCommand {
    constructor(client: Client) {
        super(client, {
            name: 'docs',
            description:
                'Get the docs of discord.js or other sources avaliables',
            global: false,
            commandOptions: [
                {
                    name: 'query',
                    description: 'Search class, or class#method()',
                    type: 3,
                    required: true,
                },
                {
                    name: 'user',
                    description: 'The user to mention',
                    required: false,
                    type: 6,
                },
                {
                    name: 'source',
                    description: 'The source to srap the doc',
                    type: 3,
                    choices: [
                        {
                            name: 'stable branch (#stable) [default]',
                            value: 'stable',
                        },
                        {
                            name: 'master branch (#master)',
                            value: 'master',
                        },
                        {
                            name: 'commando framework',
                            value: 'commando',
                        },
                        {
                            name: 'rpc - Rich Presence',
                            value: 'rpc',
                        },
                        {
                            name: 'akairo - Akairo framework',
                            value: 'akairo',
                        },
                        {
                            name: 'akairo-master - Akairo framework (#master)',
                            value: 'akairo-master',
                        },
                        {
                            name: 'collection - Util Structure',
                            value: 'collection',
                        },
                    ],
                },
            ],
        });
    }
    public async execute(
        interaction: CommandInteraction,
        client: Client,
        { query, user, source }: { query: string; user?: User; source?: string }
    ): Promise<void> {
        if (!source) source = 'stable';
        const url = `https://djsdocs.sorta.moe/v2/embed?src=${source}&q=${encodeURIComponent(
            query
        )}`;
        axios.get(url).then(({ data }) => {
            if (!data)
                return interaction.send(
                    stripIndent`
            \`❌ Error\` "${query}" was not found!
            Try an another query !`,
                    {
                        ephemeral: true,
                    }
                );
            else {
                if (user) {
                    const embed = new MessageEmbed(data);
                    interaction
                        .send(embed as unknown as any, {
                            response: `Documentation suggestion for ${user}`,
                        })
                        .catch(console.error);
                } else {
                    const embed = new MessageEmbed(data);
                    interaction
                        .send(embed as unknown as any)
                        .catch(console.error);
                }
            }
        });
    }
}