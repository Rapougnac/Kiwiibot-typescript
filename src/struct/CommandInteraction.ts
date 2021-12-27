import { CommandInteraction, Message } from 'discord.js';
import type { EmojiIdentifierResolvable, MessageReaction } from 'discord.js';
import type { APIMessage } from 'discord-api-types/v9';

CommandInteraction.prototype.react = async function (
  emoji: EmojiIdentifierResolvable
): Promise<MessageReaction> {
  if (emoji) emoji = this.client.emojis.resolveIdentifier(emoji) as string;
  if (!emoji) throw new TypeError('Invalid emoji');
  const msg = await (this.client as unknown as ClientApi).api
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .webhooks(this.client.user!.id, this.token)
    .messages('@original')
    .get();

  //@ts-expect-error: Message is private.
  const message: Message = new Message(this.client, msg);

  return message.react(emoji);
};

interface ClientApi {
  readonly api: {
    webhooks(
      userId: string,
      token: string
    ): {
      messages(id: string): {
        get(): Promise<APIMessage>;
      };
    };
  };
}
