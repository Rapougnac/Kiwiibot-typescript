import Event from '../struct/Event';
import KiwiiClient from '../struct/Client';
import * as Console from '../util/console';
import { performance } from 'perf_hooks';
const bootTime = Math.round(performance.now());
import { loadLanguages, loadPrefix } from '../../load';
import mongoose from 'mongoose';
import glob from 'glob';
import express from 'express';
import { getCommands } from '../util/getCmds';
import SlashCommand from '../struct/SlashCommand';
import { resolve, sep } from 'path';

export default class ReadyEvent extends Event {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'ready',
            once: true,
        });
    }

    public async execute(): Promise<void> {
        loadLanguages(this.client)
            .then(() => Console.success('Loaded languages', 'LoadLangs'))
            .catch(console.error);

        loadPrefix(this.client)
            .then(() => Console.success('Loaded prefix(es)', 'LoadPrefix'))
            .catch(console.error);

        await this.loadSlashs().catch(console.error);

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
        ];
        setInterval(async () => {
            const i = statuses[Math.floor(Math.random() * statuses.length)];
            await this.client.user!
                .setPresence({
                    activity: {
                        name: `${this.client.prefix}help | ${i}`,
                        type: 'PLAYING',
                    },
                    status: this.client.config.discord.status,
                })
                .catch(console.error);
        }, 1e4);
        Console.success(
            `Ready on ${this.client.guilds.cache.size
            } servers, for a total of ${this.client.guilds.cache.reduce(
                (a, b) => a + b.memberCount,
                0
            )} users`
        );
        const d = new Date(),
            timedate = [
                (d.getMonth() + 1),
                d.getDate(),
                d.getFullYear(),
            ].join('/'),
            timehrs = [
                d.getHours(),
                d.getMinutes(),
                d.getSeconds(),
            ].join(':');
        Console.success(
            `${this.client.user!.username} is now Online! (Loaded in ${bootTime} ms)\n`,
            `${timedate} ${timehrs}`
        );
        //express
        const app = express();
        const x = {
            guilds: this.client.guilds.cache.size,
            users: this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
            channels: this.client.channels.cache.size,
        };
        app.set('view engine', 'ejs');

        app.get('/', (req, res) => {
            res.status(200).sendFile(`${process.cwd()}/src/dash/Main.html`);
        });
        app.use(express.static(`${process.cwd()}/src/dash/`));
        app.get('/about', (req, res) => {
            res.status(200).send(x);
        });
        const { client } = this;
        app.get('/commands', (req, res) => {
            const commands = getCommands(client);
            res
                .status(200)
                .render(`${process.cwd()}/src/dash/ejs/main.ejs`, { commands, client });
        });
        app.listen(this.client.config.port);
    }

    public async loadSlashs(): Promise<void> {
        const files = glob.sync('./dist/src/slash_commands/**/*.js');

        files.forEach(async (file) => {
            const filePath = resolve(process.cwd(), '\\', file);
            let command: SlashCommand | null = await import(`${filePath}`);

            if (this.client.utils.isClass(command)) {
                if (command) {
                    //@ts-ignore
                    command = await new (import(`${filePath}`)(this.client));
                    if (command!.global) {
                        (this.client as any).api
                            .applications(this.client.user!.id)
                            .post({
                                data: {
                                    name: command!.name,
                                    description: command!.description,
                                    options: command!.commandOptions,
                                },
                            });
                    } else {
                        (this.client as any).api
                            .applications(this.client.user!.id)
                            .guilds('692311924448297011')
                            .commands.post({
                                data: {
                                    name: command!.name,
                                    description: command!.description,
                                    options: command!.commandOptions,
                                },
                            });
                    }
                    this.client.slashs.set(
                        command!.name,
                        command as SlashCommand
                    );
                    console.log(
                        `Command posted: ${command!.name} from ${resolve(
                            process.cwd() + sep + file
                        )} [${command!.global ? 'global' : 'guild'}]`
                    );
                }
            } else command = null;
        });
        const globalCommands = await (this.client as any).api
            .applications(this.client.user!.id)
            .commands.get();
        const guildCommands = await (this.client as any).api
            .applications(this.client.user!.id)
            .guilds('692311924448297011')
            .commands.get();
        globalCommands.forEach((globCmd: any) => {
            console.log(
                `Global command has been loaded: ${globCmd.name} | [${globCmd.id}]`
            );
        });
        guildCommands.forEach((guildCmd: any) => {
            console.log(
                `Guild command has been loaded: ${guildCmd.name} | [${guildCmd.id}]`
            );
        });
    }
}
