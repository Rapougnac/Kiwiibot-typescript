import glob from 'glob';
import type Client from '../struct/Client';
import * as path from 'path';
import { ConstructorCommand } from '../struct/interfaces/Command';

const getCommands = async (client: Client): Promise<any[]> => {
    // let categs: any[] = [];
    const value: any[] = [];
    let files = glob.sync('./dist/src/commands/**/*.js');
    const exclude = client.config.discord.dev.exclude_cmd;
    const include = client.config.discord.dev.include_cmd;
    if (client.config.discord.dev.active) {
        if (include.length) {
            files = files.filter((file) =>
                include.includes(path.parse(file).base)
            );
        }
        if (exclude.length) {
            files = files.filter(
                (file) => !exclude.includes(path.parse(file).base)
            );
        }
    }
    // let data: {
    //     name?: string;
    //     value?: Array<{
    //         name: string;
    //         description: string;
    //         aliases: Array<string>;
    //         utilisation: string;
    //         category: string;
    //     }>;
    // } = {};
    files.forEach(async (file) => {
        try {
            const filePath = path.resolve(`${process.cwd()}${path.sep}${file}`);
            let Command: ConstructorCommand = await import(`${filePath}`);
            Command = (Command as any).default;

            const command = new Command(client);

            if (!isConstructor(command) && !command.config.hidden) {
                value.push({
                    name: command.help.name,
                    description: command.help.description
                        ? command.help.description
                        : 'Not setted',
                    aliases: command.config.aliases
                        ? command.config.aliases
                        : "There's no aliases setted!",
                    utilisation: command.help.utilisation
                        ? command.help.utilisation
                        : "There's no avaliable usage!",
                    category: command.help.category
                        ? command.help.category
                        : 'Unspecified',
                    clientPermissions:
                        command.config.clientPermissions.length !== 0
                            ? command.config.clientPermissions
                            : 'None',
                    permissions:
                        command.config.permissions.length !== 0
                            ? command.config.permissions
                            : 'None',
                });
            }
        } catch (e) {}
    });
    // I need to await this, even if that make non sense 🤷
    return await value;
};

const isConstructor = (f: object | any) => {
    try {
        new f();
    } catch (e: any) {
        if (e.message.indexOf('is not a constructor') >= 0) {
            return false;
        }
    }
    return true;
};

export { getCommands };
