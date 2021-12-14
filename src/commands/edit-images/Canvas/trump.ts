import type { Message } from 'discord.js';
import Command from '../../../struct/Command';
import type Client from '../../../struct/Client';
import GifEncoder from 'gifencoder';
import { join } from 'path';
import { createCanvas, loadImage } from 'canvas';
import Canvas from '../../../struct/Canvas';
import frames from '../../../assets/json/frames.json';
export default class TrumpCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'trump',
            aliases: ['illegal'],
            description:
                'Say everything to trump, verbs are: `is`, `are` & `am`, if no verb was provided, the default will be `is`',
            category: 'edit-images',
            cooldown: 5,
            utilisation: '{prefix}trump <verb> [text]',
            img: 'https://image.flaticon.com/icons/png/512/3085/3085916.png',
            clientPermissions: [
                'SEND_MESSAGES',
                'VIEW_CHANNEL',
                'ATTACH_FILES',
            ],
        });
    }
    public async execute(
        client: Client,
        message: Message,
        [verb, ...args]: string[]
    ) {
        let text = args.join(' ');
        if (text.length === 0) text = verb ?? 'IS';
        if (text.length > 20)
            return message.reply(
                'Please, insert a sentence that contains 20 characters or less.'
            );

        const arrVerbs = ['IS', 'ARE', 'AM'];
        if (!arrVerbs.includes(verb?.toUpperCase() ?? 'IS')) {
            // eslint-disable-next-line no-unused-expressions
            args.length === 0 ? text : (text = `${verb} ${text}`);
            verb = 'IS';
        }
        if (verb?.length && verb.length > 3) verb = 'IS';
        const encoder = new GifEncoder(262, 264);
        const stream = encoder.createReadStream();
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(100);
        encoder.setQuality(200);
        loopFrames: for (const frame of frames) {
            // eslint-disable-next-line no-await-in-loop
            const image = await loadImage(
                join(
                    process.cwd(),
                    'src',
                    'assets',
                    'images',
                    'illegal',
                    frame.file
                )
            );
            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            if (!frame.show) {
                encoder.addFrame(ctx);
                continue loopFrames;
            }
            ctx.textBaseline = 'top';
            ctx.font = '20px Open Sans';
            const maxLength =
                (frame.corners[1]?.[0] ?? 0) - (frame.corners[0]?.[0] ?? 0);
            ctx.fillText(
                `${text}\n${verb?.toUpperCase()} NOW\nILLEGAL`,
                frame.corners[0]?.[0] ?? 0,
                frame.corners[0]?.[1] ?? 0,
                maxLength
            );
            encoder.addFrame(ctx);
        }
        encoder.finish();
        const buffer = await Canvas.streamToArray(stream);
        await client.utils.loader.start({
            length: 4,
            time: 1250,
            allowMessage: true,
            message,
            deleteMessage: true,
        });
        return message.channel.send({
            files: [
                {
                    attachment: Buffer.concat(buffer),
                    name: 'illegal.gif',
                },
            ],
        });
    }
}
