import KiwiiClient from './Client';
import { REST } from '@discordjs/rest';
import {
    Routes,
    RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v9';
import { CommandOptions } from './interfaces/SlashCommand';
import SlashCommand from './SlashCommand';
import { CommandInteraction } from 'discord.js';

export default class InteractionManager {
    readonly client: KiwiiClient;
    #rest: REST;
    public constructor(client: KiwiiClient) {
        this.client = client;
        this.#rest = new REST({ version: '9' }).setToken(
            client.config.discord.token
        );
    }

    public registerSlashCommands(
        commands: {
            name: string;
            description: string;
            options: CommandOptions[];
        }[],
        guildId?: string
    ) {
        if (guildId) {
            // this.#rest
            //     .put(
            //         ,
            //         {
            //             body: commands,
            //         }
            //     )
            //     .catch(console.error);
            this.#rest
                .get(
                    Routes.applicationGuildCommands(
                        this.client.user!.id,
                        guildId
                    )
                )
                .then((data) => {
                    for (const command of data as any) {
                        this.#rest.delete(
                            `${Routes.applicationGuildCommands(
                                this.client.user?.id ?? '776825747897319424',
                                guildId
                            )}/${command.id}`
                        );
                    }
                });
        } else {
            this.#rest
                .put(
                    Routes.applicationCommands(
                        this.client.user?.id ?? '776825747897319424'
                    ),
                    {
                        body: commands,
                    }
                )
                .catch(console.error);
        }
    }

    public parseOptions(
        interaction: CommandInteraction,
        options?: CommandOptions[]
    ) {
        if (!options) return;
        const args: {
            [key: string]: any;
        } = {};
        for (const option of options) {
            if (option.options) {
                if (option.options.length > 0) {
                    args['args'] = this.parseOptions(
                        interaction,
                        option.options
                    );
                }
            }
            switch (option.type) {
                case 1:
                    args[option.name] = interaction.options.getSubcommand(
                        option.required ?? true
                    );
                    break;
                case 2:
                    args[option.name] = interaction.options.getSubcommandGroup(
                        option.required ?? true
                    );
                    break;
                case 3:
                    args[option.name] = interaction.options.getString(
                        option.name,
                        option.required
                    );
                    break;
                case 4:
                    args[option.name] = interaction.options.getInteger(
                        option.name,
                        option.required
                    );
                    break;
                case 5:
                    args[option.name] = interaction.options.getBoolean(
                        option.name,
                        option.required
                    );
                    break;
                case 6:
                    args[option.name] = interaction.options.getUser(
                        option.name,
                        option.required
                    );
                    break;
                case 7:
                    args[option.name] = interaction.options.getChannel(
                        option.name,
                        option.required
                    );
                    break;
                case 8:
                    args[option.name] = interaction.options.getRole(
                        option.name,
                        option.required
                    );
                    break;
                case 9:
                    args[option.name] = interaction.options.getMentionable(
                        option.name,
                        option.required
                    );
                    break;
            }
        }

        return args;
    }
}
