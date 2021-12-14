import type KiwiiClient from './Client';
import type { CommandOptions } from './interfaces/SlashCommand';
import type { CommandInteraction } from 'discord.js';

export default class InteractionManager {
    readonly client: KiwiiClient;
    public constructor(client: KiwiiClient) {
        this.client = client;
    }

    public parseOptions(
        interaction: CommandInteraction,
        options?: CommandOptions[]
    ) {
        if (!options) return;
        const args: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
        } = {};
        for (const option of options) {
            if (option.options) {
                if (option.options.length > 0) {
                    args[`args_${option.name}`] = this.parseOptions(
                        interaction,
                        option.options
                    );
                    // Do this, otherwise the args are cleared.
                    if (args[`args_${option.name}`]) {
                        args[option.name] = args[`args_${option.name}`];
                        delete args[`args_${option.name}`];
                    }
                    continue;
                }
            }
            switch (option.type) {
                case 1:
                    args['subcommand'] = interaction.options.getSubcommand(
                        option.required ?? false
                    );
                    break;
                case 2:
                    args['subcommandGroup'] =
                        interaction.options.getSubcommandGroup(
                            option.required ?? false
                        );
                    break;
                case 3:
                    if (
                        option.name &&
                        interaction.options.getString(option.name)
                    ) {
                        args[option.name] = interaction.options.getString(
                            option.name,
                            option.required
                        );
                    }
                    break;
                case 4:
                    if (
                        option.name &&
                        interaction.options.getInteger(option.name)
                    ) {
                        args[option.name] = interaction.options.getInteger(
                            option.name,
                            option.required
                        );
                    }
                    break;
                case 5:
                    if (
                        option.name &&
                        interaction.options.getBoolean(option.name)
                    ) {
                        args[option.name] = interaction.options.getBoolean(
                            option.name,
                            option.required
                        );
                    }
                    break;
                case 6:
                    if (
                        option.name &&
                        interaction.options.getUser(option.name)
                    ) {
                        args[option.name] = interaction.options.getUser(
                            option.name,
                            option.required
                        );
                    }
                    break;
                case 7:
                    if (
                        option.name &&
                        interaction.options.getChannel(option.name)
                    ) {
                        args[option.name] = interaction.options.getChannel(
                            option.name,
                            option.required
                        );
                    }
                    break;
                case 8:
                    if (
                        option.name &&
                        interaction.options.getRole(option.name)
                    ) {
                        args[option.name] = interaction.options.getRole(
                            option.name,
                            option.required
                        );
                    }
                    break;
                case 9:
                    if (
                        option.name &&
                        interaction.options.getMentionable(option.name)
                    ) {
                        args[option.name] = interaction.options.getMentionable(
                            option.name,
                            option.required
                        );
                    }
                    break;
                default:
                    break;
            }
        }

        return args;
    }
}

// function clearEmpties(o: { [key: string]: any }): { [key: string]: any } {
//     for (const key in o) {
//         if (!o[key] || typeof o[key] !== 'object') continue;

//         if (Object.keys(o[key]).length === 0) {
//             delete o[key];
//         }
//     }
//     return o;
// }
