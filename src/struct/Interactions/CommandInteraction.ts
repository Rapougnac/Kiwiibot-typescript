import Interaction from './Interaction';
import { ApplicationCommandOptionTypes } from '../../util/constants';
import {
    APIMessage,
    APIMessageContentResolvable,
    Message,
    MessageReaction,
    User,
    GuildMember,
    Channel,
    Role,
    Snowflake,
    MessageOptions,
    WebhookMessageOptions,
    MessageTarget,
    TextChannel,
    DMChannel,
    NewsChannel,
    Guild,
} from 'discord.js';
import CommandInteractionOptionResolver from './CommandInteractionOptionResolver';
import KiwiiClient from '../Client';
import {
    Options,
    SendOptions,
    InteractionDeferOptions,
    EditOptions,
    SubOptions,
    ResolvedData,
    CommandInteractionType,
} from '../interfaces/main';
export default class CommandInteraction extends Interaction {
    /**
     * The invoked application command's id
     */
    public commandId: Snowflake;
    /**
     * The invoked application command's name
     */
    public commandName: string;
    /**
     * The options passed in the data
     */
    public options: CommandInteractionOptionResolver;
    /**
     * If the Interaction is ephemeral
     */
    public ephemeral: boolean | null;
    constructor(client: KiwiiClient, data: CommandInteractionType) {
        super(client, data);
        this.commandId = data.data.id;

        this.commandName = data.data.name;

        this.options = new CommandInteractionOptionResolver(
            this.client as unknown as KiwiiClient,
            data.data.options?.map((option: Options) =>
                this.transformOption(option, data.data.resolved)
            )
        );
        this.ephemeral = null;
    }
    /**
     * Send the content passed in.
     * @param content The content of the message to send
     * @param options If the interaction should be ephemeral
     */
    async send(
        content: APIMessageContentResolvable | any,
        options: SendOptions = { ephemeral: false }
    ): Promise<string> {
        let data;
        if (options.ephemeral)
            data = {
                flags: 1 << 6,
                content: content,
            };
        else data = { content: content };
        if (typeof content === 'object' && !options.ephemeral)
            data = await createAPIMessage(
                content,
                this.channel as Channel,
                options.response as string
            );
        else if (typeof content === 'object' && options.ephemeral)
            throw new RangeError("You can't send embeds with ephemeral");

        return (this.client as any).api
            .interactions(this.id, this.token)
            .callback.post({
                data: {
                    type: 4,
                    data,
                },
            });
    }

    /**
     * Defers the reply to this interaction.
     */
    async defer(
        options: InteractionDeferOptions = {}
    ): Promise<Message | void> {
        this.ephemeral = options.ephemeral ?? false;
        await (this.client as any).api
            .interactions(this.id, this.token)
            .callback.post({
                data: {
                    type: 5,
                    data: {
                        flags: options.ephemeral ? 1 << 6 : undefined,
                    },
                },
            });

        return options.fetchReply ? await this.fetchReply() : undefined;
    }
    /**
     * Edit the interaction that has been sended.
     * @param content The content of the message
     */
    async edit(
        content: string,
        options: EditOptions = { response: '' }
    ): Promise<any> {
        let data: { content: string } | { files: object[] | null } = {
            content: content,
        };
        if (typeof content === 'object')
            data = await createAPIMessage(
                content,
                this.channel as Channel,
                options.response as string
            );
        return await (this.client as any).api
            .webhooks(this.client.user!.id, this.token)
            .messages('@original')
            .patch({
                data,
            });
    }
    /**
     * Delete the message
     * @param timeout The time to wait to delete the message from the interaction
     */
    async delete(timeout: number = 0): Promise<any> {
        if (timeout <= 0) {
            return await (this.client as any).api
                .webhooks(this.client.user!.id, this.token)
                .messages('@original')
                .delete();
        } else {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.delete());
                }, timeout);
            });
        }
    }
    /**
     * Add a reaction to the sended interaction
     * @param emoji The emoji to pass in, refers to {@link Message.react}
     */
    async react(emoji: string | null): Promise<MessageReaction> {
        if (emoji !== null) emoji = this.client.emojis.resolveIdentifier(emoji);
        if (!emoji) throw new TypeError('Invalid emoji.');
        const msg = await (this.client as any).api
            .webhooks(this.client.user!.id, this.token)
            .messages('@original')
            .get();
        const message = new Message(
            this.client,
            msg,
            this.channel as TextChannel | NewsChannel | DMChannel
        );
        return message.react(emoji);
    }

    /**
     * Fetch the reply sended to convert to a {@link Message Message object}
     * @returns The message that was sent
     */
    async fetchReply(): Promise<Message> {
        if (this.ephemeral) throw new Error('This interaction is ephemeral.');
        const msg = await (this.client as any).api
            .webhooks(this.client.user!.id, this.token)
            .messages('@original')
            .get();
        return new Message(
            this.client,
            msg,
            this.channel as TextChannel | NewsChannel | DMChannel
        );
    }
    /**
     * Transform the options of the CommandInteraction
     * @param {object} option The options to pass in
     * @param {obejct} resolved The resolved option
     */
    transformOption(
        option: Options | SubOptions,
        resolved: any
    ): { name: any; type: any } {
        //@ts-ignore
        const result: {
            name: string;
            type: string;
            value: string;
            options: Options;
            user: User | null;
            member: GuildMember | null;
            channel: Channel | null;
            role: Role | null;
        } = {
            name: option.name,
            type: ApplicationCommandOptionTypes[option.type],
        };

        if ('value' in option) result.value = option.value as string;
        if ('options' in option)
            //@ts-ignore
            result.options = option.options.map((opt) =>
                this.transformOption(opt, resolved)
            );

        if (resolved) {
            const user = resolved.users?.[option.value ?? 0];
            if (user) {
                result.user = this.client.users.add(user);
                if (!(result.user instanceof User))
                    result.user = this.client.users.resolve(user);
            }
            const member = resolved.members?.[option.value ?? 0];
            if (member) {
                result.member =
                    this.guild?.members.add({ user, ...member }) ?? member;
                if (!(result.member instanceof GuildMember))
                    result.member =
                        this.guild?.members.add({ user, ...member }) ?? member;
            }
            const channel = resolved.channels?.[option.value ?? 0];
            if (channel) {
                result.channel =
                    this.client.channels.add(
                        channel,
                        this.guild as unknown as boolean
                    ) ?? channel;
                if (!(result.channel instanceof Channel))
                    result.channel =
                        this.client.channels.add(
                            channel,
                            this.guild as unknown as boolean
                        ) ?? channel;
            }
            const role = resolved.roles?.[option.value ?? 0];
            if (role) {
                result.role =
                    this.guild?.roles.resolve(role.id) ??
                    this.guild?.roles.add(role) ??
                    role;
                if (!(result.role instanceof Role))
                    result.role =
                        this.guild?.roles.resolve(role.id) ??
                        this.guild?.roles.add(role) ??
                        role;
            }
        }

        return result;
    }
}
/**
 *
 * @param content The content of the message
 * @param channel The channel to send this message
 * @param response The response if there're embeds options
 */
async function createAPIMessage(
    content: APIMessageContentResolvable | any,
    channel: MessageTarget | Channel,
    response: APIMessageContentResolvable | any,
    options?: MessageOptions | WebhookMessageOptions
): Promise<{ files: object[] | null }> {
    const { data, files } = await APIMessage.create(
        channel as MessageTarget,
        response,
        content as any,
        options
    )
        .resolveData()
        .resolveFiles();
    return { ...data, files };
}
