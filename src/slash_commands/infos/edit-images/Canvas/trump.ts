import SlashCommand from '../../../../struct/SlashCommand';
import Canvas from '../../../../struct/Canvas';
import type KiwiiClient from '../../../../struct/Client';
import type { CommandInteraction } from 'discord.js';
import GIFEncoder from 'gifencoder';
import * as path from 'path';
import { createCanvas, loadImage } from 'canvas';
import frames from '../../../../assets/json/frames.json';

export default class TrumpSlashCommand extends SlashCommand {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'illegal',
            description: 'Write text on a Trump gif',
            commandOptions: [
                {
                    name: 'text',
                    description: 'The text to write',
                    type: 3,
                    required: true,
                },
                {
                    name: 'verb',
                    description: 'The verb to use, default is "is"',
                    type: 3,
                    choices: [
                        {
                            name: 'is',
                            value: 'is',
                        },
                        {
                            name: 'are',
                            value: 'are',
                        },
                        {
                            name: 'am',
                            value: 'am',
                        },
                    ],
                },
            ],
        });
    }

    public override async execute(
        interaction: CommandInteraction,
        { verb, text }: { verb?: 'is' | 'are' | 'am'; text: string }
    ) {
        if (!verb) verb = 'is';
        if (text.length > 20) {
            return interaction.reply('The text is too long');
        }
        const encoder = new GIFEncoder(262, 264);
        const stream = encoder.createReadStream();
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(100);
        encoder.setQuality(200);
        loopFrames: for (const frame of frames) {
            // eslint-disable-next-line no-await-in-loop
            const image = await loadImage(
                path.join(
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
                `${text}\n${verb.toUpperCase()} NOW\nILLEGAL`,
                frame.corners[0]?.[0] ?? 0,
                frame.corners[0]?.[1] ?? 0,
                maxLength
            );
            encoder.addFrame(ctx);
        }
        encoder.finish();
        const buffer = await Canvas.streamToArray(stream);
        await this.client.utils.loader.start({
            length: 4,
            time: 1250,
            allowMessage: true,
            interaction,
            deleteMessage: true,
        });
        return interaction.editReply({
            files: [
                {
                    attachment: Buffer.concat(buffer),
                    name: 'illegal.gif',
                },
            ],
        });
    }
}
