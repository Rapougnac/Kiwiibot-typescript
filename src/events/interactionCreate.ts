import Event from '../struct/Event';
import type KiwiiClient from '../struct/Client';
import type { Interaction } from 'discord.js';
import { GuildMemberManager, CommandInteraction } from 'discord.js';
import { I18n } from 'i18n';
import * as path from 'path';
import LocaleService from '../struct/LocaleService';
const _i18n = new I18n();
_i18n.configure({
  locales: ['en', 'fr'],
  directory: path.join(process.cwd(), 'locales'),
  defaultLocale: 'en',
  objectNotation: true,
});
_i18n.setLocale('en');

const i18n = new LocaleService(_i18n);
export default class InteractionCreate extends Event {
  constructor(client: KiwiiClient) {
    super(client, {
      name: 'interactionCreate',
    });
  }
  public override execute(interaction: Interaction) {
    if (!interaction.isCommand() && !interaction.isContextMenu()) return;

    if (!this.client.slashs.has(interaction.commandName)) return;
    const commandInteraction = this.client.slashs.get(interaction.commandName);
    let args;
    if (interaction instanceof CommandInteraction) {
      if (commandInteraction?.commandOptions) {
        args = this.client.interactionManager.parseOptions(
          interaction,
          commandInteraction.commandOptions
        );
      }
    }
    if (!interaction.guild) {
      Object.defineProperty(interaction, 'guild', {
        value: {
          client: this.client,
        },
        writable: true,
      });

      Object.defineProperty(interaction, 'guild', {
        value: {
          i18n,
          // @ts-expect-error: Same error in the messageCreate event
          members: new GuildMemberManager(interaction.guild),
        },
      });
    }
    if (!args) {
      try {
        void commandInteraction?.execute(interaction);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(
          `Error from command: ${interaction.commandName}: ${e.message}\n${e.stack}`
        );
        return interaction.reply({
          content: 'Sorry, there was an error executing that command',
          ephemeral: true,
        });
      }
    }
    try {
      void commandInteraction?.execute(interaction, args);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(
        `Error from command: ${interaction.commandName}: ${e.message}\n${e.stack}`
      );
      return interaction.reply({
        content: 'Sorry, there was an error executing that command',
        ephemeral: true,
      });
    }
  }
}
