import KiwiiClient from './Client';
import { CommandOptions } from './interfaces/SlashCommand';
import { CommandInteraction } from 'discord.js';

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
            [key: string]: any;
        } = {};
        for (const option of options) {
            if (option.options) {
                if (option.options.length > 0) {
                    args['args'] = this.parseOptions(
                        interaction,
                        option.options
                    );
                    continue;
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
            }
        }

        return args;
    }
}
