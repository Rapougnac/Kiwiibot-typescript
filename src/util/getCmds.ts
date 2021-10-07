import glob from 'glob';
import Command from '../struct/Command';
import Client from '../struct/Client';
import * as path from 'path';

const getCommands = (client: Client): any[] => {
    let categs: any[] = [];
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
    files.forEach((file) => {
        try {
            const command: Command = new (require(`${process.cwd()}/${file}`))(
                client
            );
            if (!isConstructor(command)) {
                if (command instanceof Command) {
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
                    });

                    let data = {
                        name: command.help.category
                            ? command.help.category
                            : 'Unspecified',
                        value,
                    };
                    categs.push(data);
                }
            }
        } catch (e) {}
    });
    return categs;
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
