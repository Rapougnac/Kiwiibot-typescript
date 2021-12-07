import KiwiiClient from '../struct/Client';
import * as path from 'path';
import express from 'express';
import {
    beautifyCategories,
    upperFirstButAcceptEmojis,
    translatePermissions,
    remove,
} from '../util/string';
import i18nHelper from '../dashboard/public/i18nHelper';
import i18n from 'i18n';

const app = express();

export default async function (client: KiwiiClient) {
    app.set('view engine', 'ejs');
    app.use(express.static(path.resolve(`${process.cwd()}/src/dashboard/`)));
    app.use((_req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        next();
    });
    app.use(i18nHelper);

    app.get('/', (_req, res) => {
        res.status(200).render(
            path.resolve(`${process.cwd()}/src/dashboard/Main.ejs`),
            {
                _client: client,
                i18n,
            }
        );
    });
    app.get('/commands', async (_req, res) => {
        res.status(200).render(
            path.resolve(`${process.cwd()}/src/dashboard/ejs/commands.ejs`),
            {
                _client: client,
                upperFirstButAcceptEmojis,
                beautifyCategories,
                translatePermissions,
                remove,
                i18n,
            }
        );
    });

    /** Disablig this, not secure */
    // app.get('/api/v1/commands/:command', (req, res) => {
    //     const cmd = client.commands.find(
    //         (c) =>
    //             c.help.name.toLowerCase() === req.params.command.toLowerCase()
    //     );
    //     if (!cmd) return res.status(404).json({ error: 'Command not found' });
    //     res.status(200).json(cmd);
    // });
    app.get('*', (_req, res) => {
        res.status(404).render(
            path.join(process.cwd(), 'src', 'dashboard', 'ejs', '404.ejs')
        );
    });
    app.use('*', (req, res, next) => {
        try {
            req.query['lang'] =
                req.query['lang'] || req.cookies['lang'] || 'en';
            return next();
        } catch (e) {
            res.status(500).send(e);
        }
    });
    app.listen(client.config.port);
}
