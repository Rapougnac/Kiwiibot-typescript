import { APIMessage, Structures, Message, MessageTarget } from 'discord.js';

class ExtAPIMessage extends APIMessage {
    //@ts-ignore
    resolveData() {
        if (this.data) return this;
        super.resolveData();
        if (
            ((this.options.allowedMentions || {}) as any).repliedUser !==
            undefined
        ) {
            if ((this.data as any).allowed_mentions === undefined) {
                (this.data as any).allowed_mentions = {};
                Object.assign((this.data as any).allowed_mentions, {
                    replied_user: (this.options as any).allowedMentions
                        .repliedUser,
                });
                delete (this.options as any).allowedMentions.repliedUser;
            }
            if ((this.options as any).replyTo !== undefined) {
                Object.assign(this.data, {
                    message_reference: {
                        message_id: (this.options as any).replyTo.id,
                    },
                });
            }
            return this;
        }
    }
}

class ExtMessage extends Message {
    // constructor(client, data, channel) {
    //   super(client, data, channel);
    //   if(channel.type === 'dm') {
    //     this.guild = {
    //       i18n: new I18n({
    //         locales: ['en', 'fr'],
    //         directory: path.join(process.cwd(), 'locales'),
    //         objectNotation: true,
    //       }),
    //     }
    //     this.guild.i18n.setLocale('en');
    //   }
    // }

    inlineReply(content: string, options: any) {
        return this.channel.send(
            ExtAPIMessage.create(
                this as unknown as MessageTarget,
                content,
                options,
                {
                    //@ts-ignore
                    replyTo: this,
                }
            ).resolveData()
        );
    }
    //@ts-ignore
    edit(content: string, options: any) {
        return super.edit(
            ExtAPIMessage.create(
                this as any as MessageTarget,
                content,
                options
            ).resolveData()
        );
    }
}
