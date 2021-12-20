/* eslint-disable no-console */
import Event from '../struct/Event';
import type KiwiiClient from '../struct/Client';
import * as Console from '../util/console';
import { performance } from 'perf_hooks';
const bootTime = Math.round(performance.now());
import { load } from '../../load';
import glob from 'glob';
import type { SlashCommandConstructor } from '../struct/interfaces/SlashCommand';
import { resolve } from 'path';
import dashboard from '../dashboard/dashboard';
import type SlashCommand from '../struct/SlashCommand';

export default class ReadyEvent extends Event {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'ready',
            once: true,
        });
    }

    public override async execute(): Promise<void> {
        load(this.client).catch(console.error);

        const statuses = [
            `Currently on ${this.client.guilds.cache.size} servers`,
            `Serving ${this.client.guilds.cache.reduce(
                (a, b) => a + b.memberCount,
                0
            )} users`,
            `Do you know how to make bots ?`,
            `Don't do drugs kids!`,
            `Is this real life?`,
            `Can I lose my virginity?`,
            `Why am I here`,
            `There's a lot of statuses no?`,
            `Ugh, Kyofu, it rhymes with tofu, so she has to be a fool`,
        ] as const;
        setInterval(() => {
            const i = statuses[Math.floor(Math.random() * statuses.length)];
            void this.client.user?.setPresence({
                activities: [
                    {
                        name: `${this.client.prefix}help | ${i}`,
                        type: 'PLAYING',
                    },
                ],
                status: this.client.config.discord.status,
            });
        }, 1e4);
        Console.success(
            `Ready on ${this.client.guilds.cache.size
            } servers, for a total of ${this.client.guilds.cache.reduce(
                (a, b) => a + b.memberCount,
                0
            )} users`
        );
        const d = new Date(),
            timedate = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join(
                '/'
            ),
            timehrs = [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
        Console.success(
            `${this.client.user?.username} is now Online! (Loaded in ${bootTime} ms)\n`,
            `${timedate} ${timehrs}`
        );
        // Dashboard
        dashboard(this.client);
        const commands = await this.loadSlashs();
        commands.forEach((command) => {
            void (async () => {
                if (!command) return;
                if (!command.global) {
                    const guild = await this.client.guilds.fetch(
                        '911736666551640075'
                    );
                    if (['USER'].includes(command.command.type)) command.command.description = '';
                    guild.commands.create(command.command.toJSON());
                } else {
                    this.client.application?.commands.create(
                        command.command.toJSON()
                    );
                }
            })();
        });
    }

    public async loadSlashs(): Promise<
        [{ command: SlashCommand; global?: boolean }?]
    > {
        const files = glob.sync('./dist/src/slash_commands/**/*.js');
        const commands: [{ global?: boolean; command: SlashCommand }?] = [];
        try {
            files.forEach((file) => {
                void (async () => {
                    const filePath = resolve(process.cwd(), file);
                    let SlashCommand: SlashCommandConstructor = await import(
                        `${filePath}`
                    );
                    SlashCommand = (SlashCommand as unknown as { default: SlashCommandConstructor }).default;
                    if (this.client.utils.isClass(SlashCommand)) {
                        const command = new SlashCommand(this.client);
                        if (command.global) {
                            commands.push({ global: true, command });
                        } else {
                            commands.push({ global: false, command });
                        }
                        this.client.slashs.set(command.name, command);
                    }
                })();
            });
        } catch (e) {
            return Promise.reject(e);
        }
        return Promise.resolve(commands);
    }
}
