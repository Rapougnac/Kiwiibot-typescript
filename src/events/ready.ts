import Event from '../struct/Event';
import KiwiiClient from '../struct/Client';
import * as Console from '../util/console';
import { performance } from 'perf_hooks';
const bootTime = Math.round(performance.now());
import { loadLanguages, loadPrefix } from '../../load';
import glob from 'glob';
import express from 'express';
import { getCommands } from '../util/getCmds';
import { resolve, sep } from 'path';
import { SlashCommandConstructor } from '../struct/interfaces/main';
import * as path from 'path';
import { beautifyCategories, upperFirstButAcceptEmojis } from '../util/string';
// import fetch from 'node-fetch';

export default class ReadyEvent extends Event {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'ready',
            once: true,
        });
    }

    public override async execute(): Promise<void> {
        loadLanguages(this.client)
            .then(() => Console.success('Loaded languages', 'LoadLangs'))
            .catch(console.error);

        loadPrefix(this.client)
            .then(() => Console.success('Loaded prefix(es)', 'LoadPrefix'))
            .catch(console.error);

        // await this.loadSlashs().catch(console.error);

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
            this.client.user!.setPresence({
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
            `Ready on ${
                this.client.guilds.cache.size
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
            `${
                this.client.user!.username
            } is now Online! (Loaded in ${bootTime} ms)\n`,
            `${timedate} ${timehrs}`
        );
        //express
        const app = express();
        let commands = await getCommands(this.client);
        // commands = commands.filter(
        //     (v, i, a) => a.findIndex((t) => t.name === v.name) === i
        // );
        // commands.forEach(
        //     (cmd) =>
        //         (cmd.value = cmd.value.filter(
        //             (c: any) => c.category === cmd.name
        //         ))
        // );
        const x = {
            guilds: this.client.guilds.cache.size,
            users: this.client.guilds.cache.reduce(
                (a, b) => a + b.memberCount,
                0
            ),
            channels: this.client.channels.cache.size,
            commands,
            beautifyCategories,
            upperFirstButAcceptEmojis,
        };
        app.set('view engine', 'ejs');

        app.get('/', (_req, res) => {
            res.status(200).render(
                path.resolve(`${process.cwd()}/src/dashboard/Main.ejs`),
                {
                    _client: this.client,
                }
            );
        });
        app.use(
            express.static(path.resolve(`${process.cwd()}/src/dashboard/`))
        );
        app.use((_req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', '*');
            next();
        });
        app.get('/api', async (req, res) => {
            if (req.query['token'] === this.client.config.kiwii.apiKey)
                res.status(200).json(x);
            else
                res.status(403).json({
                    error: 403,
                    message: 'Invalid API Key',
                });
        });
        const { client } = this;
        app.get('/commands', async (_req, res) => {
            res.status(200).render(
                `${process.cwd()}/src/dashboard/ejs/commands.ejs`,
                {
                    _client: client,
                    commands,
                    upperFirstButAcceptEmojis,
                    beautifyCategories,
                }
            );
        });
        app.listen(this.client.config.port);
    }

    public async loadSlashs(): Promise<void> {
        const files = glob.sync('./dist/src/slash_commands/**/*.js');

        files.forEach(async (file) => {
            const filePath = resolve(process.cwd(), file);
            let SlashCommand: SlashCommandConstructor = await import(
                `${filePath}`
            );
            SlashCommand = (SlashCommand as any).default;
            if (this.client.utils.isClass(SlashCommand)) {
                const command = new SlashCommand(this.client);
                if (command.global) {
                    this.client.application?.commands.set([
                        {
                            name: command.name,
                            description: command.description,
                            options: command.commandOptions,
                        },
                    ]);
                } else {
                    this.client.guilds.cache
                        .get('895600122510069801')
                        ?.commands.set([
                            {
                                name: command.name,
                                description: command.description,
                                options: command.commandOptions,
                            },
                        ]);
                }
                this.client.slashs.set(command.name, command);
                console.log(
                    `Command posted: ${command!.name} from ${resolve(
                        process.cwd() + sep + file
                    )} [${command!.global ? 'global' : 'guild'}]`
                );
            }
        });
        const globalCommands = await this.client.application?.commands.fetch();
        const guildCommands = await this.client.guilds.cache
            .get('895600122510069801')
            ?.commands.fetch();
        globalCommands?.toJSON().forEach((globCmd: any) => {
            // console.log(
            //     `Global command has been loaded: ${globCmd.name} | [${globCmd.id}]`
            // );
            console.log(globCmd);
        });
        guildCommands?.toJSON().forEach((guildCmd: any) => {
            // console.log(
            //     `Guild command has been loaded: ${guildCmd.name} | [${guildCmd.id}]`
            // );
            console.log(guildCmd);
        });
    }
}
