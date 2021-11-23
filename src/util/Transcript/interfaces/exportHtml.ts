import { MessageAttachment as _MessageAttachment } from 'discord.js';

export interface ExportHtmlOptions {
    /**
     * Whether to return a {@link Buffer} instead of a {@link _MessageAttachment MessageAttachment}.
     */
    returnBuffer?: boolean;

    /**
     * The name of the file to export.
     * @default 'transcript.html'
     */
    fileName?: string;
}
