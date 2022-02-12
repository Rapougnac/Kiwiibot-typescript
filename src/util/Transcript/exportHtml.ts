import type { TextChannel, MessageEmbed } from 'discord.js';
import { Message, Collection, MessageAttachment } from 'discord.js';
import jsdom = require('jsdom');
import * as fs from 'fs';
import * as path from 'path';
import purify from 'dompurify';
import he from 'he';
import type { ExportHtmlOptions } from './interfaces/exportHtml';
import * as staticValues from './static/static';
import hljs from 'highlight.js';
// import util from 'util';
// eslint-disable-next-line @typescript-eslint/naming-convention
const { JSDOM } = jsdom;

const template = fs.readFileSync(
  path.join(
    process.cwd(),
    'src',
    'util',
    'Transcript',
    'static',
    'template.html'
  ),
  'utf8'
);

export default function generateTranscript(
  messages: Message[] | Collection<string, Message>,
  channel: TextChannel,
  options: ExportHtmlOptions = {
    fileName: 'transcript.html',
  }
): Buffer | MessageAttachment {
  const dom = new JSDOM(template.replace('{{TITLE}}', channel.name));
  const { document } = dom.window;

  const DOMPurify = purify(dom.window as unknown as Window);
  DOMPurify.setConfig({
    ALLOWED_TAGS: [],
  });
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { sanitize: xss } = DOMPurify;

  (
    document.getElementsByClassName(
      'preamble__guild-icon'
    )[0] as HTMLImageElement
  ).src =
    channel.guild.iconURL({
      dynamic: true,
      size: 4096,
      format: 'png',
    }) ?? staticValues.DummyUser.displayAvatarURL();
  const guildName = document.getElementById('guild_name');
  const ticketName = document.getElementById('ticketname');
  const link = document.querySelector('link');
  if (guildName) guildName.textContent = channel.guild.name;
  if (ticketName) ticketName.textContent = channel.name;
  if (link)
    link.href =
      channel.guild.iconURL({
        dynamic: true,
        size: 4096,

        format: 'png',
      }) ?? staticValues.DummyUser.displayAvatarURL();
  const transcript = document.getElementById('chatlog');

  for (const message of Array.from(messages.values()).sort(
    (a, b) => a.createdTimestamp - b.createdTimestamp
  )) {
    const messageGroup = document.createElement('div');
    messageGroup.classList.add('chatlog__message-group');

    if (message.reference?.messageId) {
      const referenceSymbol = document.createElement('div');
      referenceSymbol.classList.add('chatlog__reference-symbol');

      const reference = document.createElement('div');
      reference.classList.add('chatlog__reference');

      const referencedMessage =
        messages instanceof Collection
          ? messages.get(message.reference.messageId)
          : messages.find((m) => m.id === message.reference?.messageId);
      const author = referencedMessage?.author ?? staticValues.DummyUser;

      reference.innerHTML = `<img class="chatlog__reference-avatar" src="${author.displayAvatarURL(
        { dynamic: true, format: 'png', size: 4096 }
      )}" alt="Avatar" loading="lazy">
            <span class="chatlog__reference-name" title="${author.username.replace(
              /"/g,
              ''
            )}" style="color: ${author.hexAccentColor ?? '#FFFFFF'}">${
        author.bot
          ? `<span class="chatlog__bot-tag">BOT</span> ${xss(author.username)}`
          : xss(author.username)
      }</span>
            <div class="chatlog__reference-content">
                <span class="chatlog__reference-link" onclick="scrollToMessage(event, '${
                  message.reference.messageId
                }')">
                        ${
                          referencedMessage?.content
                            ? `${formatContent(
                                referencedMessage.content,
                                referencedMessage,
                                false,
                                true
                              )}...`
                            : '<em>Click to see attachment</em>'
                        }
                </span>
            </div>`;

      messageGroup.appendChild(referenceSymbol);
      messageGroup.appendChild(reference);
    }

    const author = message.author;

    const authorElement = document.createElement('div');
    authorElement.classList.add('chatlog__author-avatar-container');

    const authorAvatar = document.createElement('img');
    authorAvatar.classList.add('chatlog__author-avatar');
    authorAvatar.src = author.displayAvatarURL({
      format: 'png',
      size: 4096,
      dynamic: true,
    });
    authorAvatar.alt = 'Avatar';
    authorAvatar.loading = 'lazy';

    authorElement.appendChild(authorAvatar);
    messageGroup.appendChild(authorElement);

    const content = document.createElement('div');
    content.classList.add('chatlog__messages');

    const authorName = document.createElement('span');
    authorName.classList.add('chatlog__author-name');
    authorName.title = xss(author.tag);
    authorName.textContent = author.username;
    authorName.style.color = author.hexAccentColor ?? '#FFFFFF';
    authorName.setAttribute('data-user-id', author.id);

    content.appendChild(authorName);

    if (author.bot) {
      const botTag = document.createElement('span');
      botTag.classList.add('chatlog__bot-tag');
      botTag.textContent = 'BOT';
      content.appendChild(botTag);
    }

    const timestamp = document.createElement('span');
    timestamp.classList.add('chatlog__timestamp');
    timestamp.textContent = message.createdAt.toLocaleString();

    content.appendChild(timestamp);

    const messageContent = document.createElement('div');
    messageContent.classList.add('chatlog__message');
    messageContent.setAttribute('data-message-id', message.id);
    messageContent.setAttribute('id', `message-${message.id}`);
    messageContent.title = `Message sent: ${message.createdAt.toLocaleString()}`;

    if (message.content) {
      const messageContentContent = document.createElement('div');
      messageContentContent.classList.add('chatlog__content');

      const messageContentContentMarkdown = document.createElement('div');
      messageContentContentMarkdown.classList.add('markdown');

      const messageContentContentMarkdownSpan = document.createElement('span');
      messageContentContentMarkdownSpan.classList.add('preserve-whitespace');
      messageContentContentMarkdownSpan.innerHTML = formatContent(
        message.content,
        message,
        message.webhookId !== null
      );

      messageContentContentMarkdown.appendChild(
        messageContentContentMarkdownSpan
      );
      messageContentContent.appendChild(messageContentContentMarkdown);
      messageContent.appendChild(messageContentContent);
    }

    if (message.attachments.size > 0) {
      for (const attachment of message.attachments.values()) {
        const attachmentsDiv = document.createElement('div');
        attachmentsDiv.classList.add('chatlog__attachment');

        const attachmentType = attachment.name?.split('.').pop();

        if (['png', 'jpg', 'jpeg', 'gif'].includes(attachmentType ?? '')) {
          const attachmentLink = document.createElement('a');

          const attachmentImage = document.createElement('img');
          attachmentImage.classList.add('chatlog__attachment-media');
          attachmentImage.src = attachment.url;
          attachmentImage.alt = 'Image attachment';
          attachmentImage.loading = 'lazy';
          attachmentImage.title = `Image: ${attachment.name} (${formatBytes(
            attachment.size
          )})`;

          attachmentLink.appendChild(attachmentImage);
          attachmentsDiv.appendChild(attachmentLink);
        } else if (['mp4', 'webm'].includes(attachmentType ?? '')) {
          const attachmentVideo = document.createElement('video');
          attachmentVideo.classList.add('chatlog__attachment-media');
          attachmentVideo.src = attachment.url;
          attachmentVideo.controls = true;
          attachmentVideo.title = `Video: ${attachment.name} (${formatBytes(
            attachment.size
          )})`;

          attachmentsDiv.appendChild(attachmentVideo);
        } else if (['mp3', 'ogg'].includes(attachmentType ?? '')) {
          const attachmentAudio = document.createElement('audio');
          attachmentAudio.classList.add('chatlog__attachment-media');
          attachmentAudio.src = attachment.url;
          attachmentAudio.controls = true;
          attachmentAudio.title = `Audio: ${attachment.name} (${formatBytes(
            attachment.size
          )})`;

          attachmentsDiv.appendChild(attachmentAudio);
        } else {
          const attachmentGeneric = document.createElement('div');
          attachmentGeneric.classList.add('chatlog__attachment-generic');

          const attachmentGenericIcon = document.createElement('svg');
          attachmentGenericIcon.classList.add(
            'chatlog__attachment-generic-icon'
          );

          const attachmentGenericIconUse = document.createElement('use');
          attachmentGenericIconUse.setAttribute('href', '#icon-attachment');

          attachmentGenericIcon.appendChild(attachmentGenericIconUse);
          attachmentGeneric.appendChild(attachmentGenericIcon);

          const attachmentGenericName = document.createElement('div');
          attachmentGenericName.classList.add(
            'chatlog__attachment-generic-name'
          );

          const attachmentGenericNameLink = document.createElement('a');
          attachmentGenericNameLink.href = attachment.url;
          attachmentGenericNameLink.textContent = attachment.name;

          attachmentGenericName.appendChild(attachmentGenericNameLink);
          attachmentGeneric.appendChild(attachmentGenericName);

          const attachmentGenericSize = document.createElement('div');
          attachmentGenericSize.classList.add(
            'chatlog__attachment-generic-size'
          );

          attachmentGenericSize.textContent = `${formatBytes(attachment.size)}`;
          attachmentGeneric.appendChild(attachmentGenericSize);

          attachmentsDiv.appendChild(attachmentGeneric);
        }

        messageContent.appendChild(attachmentsDiv);
      }
    }

    content.appendChild(messageContent);

    if (message.embeds.length > 0) {
      for (const embed of message.embeds) {
        const embedDiv = document.createElement('div');
        embedDiv.classList.add('chatlog__embed');

        if (embed.hexColor) {
          const embedColorPill = document.createElement('div');
          embedColorPill.classList.add('chatlog__embed-color-pill');
          embedColorPill.style.backgroundColor = embed.hexColor;

          embedDiv.appendChild(embedColorPill);
        }

        const embedContentContainer = document.createElement('div');
        embedContentContainer.classList.add('chatlog__embed-content-container');

        const embedContent = document.createElement('div');
        embedContent.classList.add('chatlog__embed-content');

        const embedText = document.createElement('div');
        embedText.classList.add('chatlog__embed-text');

        if (embed.author?.name) {
          const embedAuthor = document.createElement('div');
          embedAuthor.classList.add('chatlog__embed-author');

          if (embed.author.iconURL) {
            const embedAuthorIcon = document.createElement('img');
            embedAuthorIcon.classList.add('chatlog__embed-author-icon');
            embedAuthorIcon.src = embed.author.iconURL;
            embedAuthorIcon.alt = 'Author icon';
            embedAuthorIcon.loading = 'lazy';
            embedAuthorIcon.onerror = () =>
              (embedAuthorIcon.style.visibility = 'hidden');

            embedAuthor.appendChild(embedAuthorIcon);
          }

          const embedAuthorName = document.createElement('span');
          embedAuthorName.classList.add('chatlog__embed-author-name');

          if (embed.author.url) {
            const embedAuthorNameLink = document.createElement('a');
            embedAuthorNameLink.classList.add(
              'chatlog__embed-author-name-link'
            );
            embedAuthorNameLink.href = embed.author.url;
            embedAuthorNameLink.textContent = embed.author.name;

            embedAuthorName.appendChild(embedAuthorNameLink);
          } else {
            embedAuthorName.textContent = embed.author.name;
          }

          embedAuthor.appendChild(embedAuthorName);
          embedText.appendChild(embedAuthor);
        }

        if (embed.title) {
          const embedTitle = document.createElement('div');
          embedTitle.classList.add('chatlog__embed-title');

          if (embed.url) {
            const embedTitleLink = document.createElement('a');
            embedTitleLink.classList.add('chatlog__embed-title-link');
            embedTitleLink.href = embed.url;

            const embedTitleMarkdown = document.createElement('div');
            embedTitleMarkdown.classList.add('markdown', 'preserve-whitespace');
            embedTitleMarkdown.textContent = embed.title;

            embedTitleLink.appendChild(embedTitleMarkdown);
            embedTitle.appendChild(embedTitleLink);
          } else {
            const embedTitleMarkdown = document.createElement('div');
            embedTitleMarkdown.classList.add('markdown', 'preserve-whitespace');
            embedTitleMarkdown.textContent = embed.title;

            embedTitle.appendChild(embedTitleMarkdown);
          }

          embedText.appendChild(embedTitle);
        }

        if (embed.description) {
          const embedDescription = document.createElement('div');
          embedDescription.classList.add('chatlog__embed-description');

          const embedDescriptionMarkdown = document.createElement('div');
          embedDescriptionMarkdown.classList.add(
            'markdown',
            'preserve-whitespace'
          );
          embedDescriptionMarkdown.innerHTML = formatContent(
            embed.description,
            embed,
            true
          );

          embedDescription.appendChild(embedDescriptionMarkdown);
          embedText.appendChild(embedDescription);
        }

        if (embed.fields.length > 0) {
          const embedFields = document.createElement('div');
          embedFields.classList.add('chatlog__embed-fields');

          for (const field of embed.fields) {
            const embedField = document.createElement('div');
            embedField.classList.add(
              ...(!field.inline
                ? ['chatlog__embed-field']
                : ['chatlog__embed-field', 'chatlog__embed-field--inline'])
            );

            const embedFieldName = document.createElement('div');
            embedFieldName.classList.add('chatlog__embed-field-name');

            const embedFieldNameMarkdown = document.createElement('div');
            embedFieldNameMarkdown.classList.add(
              'markdown',
              'preserve-whitespace'
            );
            embedFieldNameMarkdown.textContent = field.name;

            embedFieldName.appendChild(embedFieldNameMarkdown);
            embedField.appendChild(embedFieldName);

            const embedFieldValue = document.createElement('div');
            embedFieldValue.classList.add('chatlog__embed-field-value');

            const embedFieldValueMarkdown = document.createElement('div');
            embedFieldValueMarkdown.classList.add(
              'markdown',
              'preserve-whitespace'
            );
            embedFieldValueMarkdown.innerHTML = formatContent(
              field.value,
              undefined,
              true
            );

            embedFieldValue.appendChild(embedFieldValueMarkdown);
            embedField.appendChild(embedFieldValue);

            embedFields.appendChild(embedField);
          }

          embedText.appendChild(embedFields);
        }

        embedContent.appendChild(embedText);

        if (embed.thumbnail?.proxyURL ?? embed.thumbnail?.url) {
          const embedThumbnail = document.createElement('div');
          embedThumbnail.classList.add('chatlog__embed-thumbnail-container');

          const embedThumbnailLink = document.createElement('a');
          embedThumbnailLink.classList.add('chatlog__embed-thumbnail-link');
          embedThumbnailLink.href = embed.thumbnail.url;

          const embedThumbnailImage = document.createElement('img');
          embedThumbnailImage.classList.add('chatlog__embed-thumbnail');
          embedThumbnailImage.src = embed.thumbnail.url;
          embedThumbnailImage.alt = 'Thumbnail';
          embedThumbnailImage.loading = 'lazy';

          embedThumbnailLink.appendChild(embedThumbnailImage);
          embedThumbnail.appendChild(embedThumbnailLink);

          embedContent.appendChild(embedThumbnail);
        }

        embedContentContainer.appendChild(embedContent);

        if (embed.image) {
          const embedImage = document.createElement('div');
          embedImage.classList.add('chatlog__embed-image-container');

          const embedImageLink = document.createElement('a');
          embedImageLink.classList.add('chatlog__embed-image-link');
          embedImageLink.href = embed.image.url;

          const embedImageImage = document.createElement('img');
          embedImageImage.classList.add('chatlog__embed-image');
          embedImageImage.src = embed.image.url;
          embedImageImage.alt = 'Image';
          embedImageImage.loading = 'lazy';

          embedImageLink.appendChild(embedImageImage);
          embedImage.appendChild(embedImageLink);

          embedContentContainer.appendChild(embedImage);
        }

        if (embed.footer?.text) {
          const embedFooter = document.createElement('div');
          embedFooter.classList.add('chatlog__embed-footer');

          if (embed.footer.iconURL) {
            const embedFooterIcon = document.createElement('img');
            embedFooterIcon.classList.add('chatlog__embed-footer-icon');
            embedFooterIcon.src = embed.footer.iconURL;
            embedFooterIcon.alt = 'Footer icon';
            embedFooterIcon.loading = 'lazy';

            embedFooter.appendChild(embedFooterIcon);
          }

          const embedFooterText = document.createElement('span');
          embedFooterText.classList.add('chatlog__embed-footer-text');
          embedFooterText.textContent = embed.timestamp
            ? `${embed.footer.text} • ${new Date(
                embed.timestamp
              ).toLocaleString()}`
            : embed.footer.text;

          embedFooter.appendChild(embedFooterText);

          embedContentContainer.appendChild(embedFooter);
        }

        embedDiv.appendChild(embedContentContainer);
        content.appendChild(embedDiv);
      }
    }

    messageGroup.appendChild(content);
    transcript?.appendChild(messageGroup);
  }

  return options.returnBuffer
    ? Buffer.from(
        `<!-- This is an autogenerated file. Please do not edit directly -->\n\n${dom.serialize()}`
      )
    : new MessageAttachment(
        Buffer.from(
          `<!-- This is an autogenerated file. Please do not edit directly -->\n\n${dom.serialize()}`
        ),
        options.fileName ?? 'transcript.html'
      );
}

const languages = hljs.listLanguages();

function formatContent(
  content: string,
  message?: Message | MessageEmbed,
  allowExtra = false,
  replyStyle = false,
  purify = he.escape
) {
  content = purify(content)
    .replace(/&#x60;/g, '`')
    .replace(/```(.+?)```/gs, (code: string) => {
      if (!replyStyle) {
        const split = code.slice(3, -3).split('\n');

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let language = split.shift()!.trim().toLowerCase();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((staticValues.LanguageAliases as any)[language])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          language = (staticValues.LanguageAliases as any)[language];

        if (languages.includes(language)) {
          const joined = he.unescape(split.join('\n'));
          return `<div class="pre pre--multiline language-${language}">${
            hljs.highlight(joined, {
              language,
            }).value
          }</div>`;
        } else {
          return `<div class="pre pre--multiline nohighlight">${code
            .slice(3, -3)
            .trim()}</div>`;
        }
      } else {
        const split = code.slice(3, -3).split('\n');
        split.shift();

        const joined = he.unescape(split.join('\n'));

        return `<span class="pre pre--inline">${joined.substring(
          0,
          42
        )}</span>`;
      }
    })
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<s>$1</s>')
    .replace(/__(.+?)__/g, '<u>$1</u>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, `<span class="pre pre--inline">$1</span>`)
    .replace(
      // eslint-disable-next-line no-useless-escape
      /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,10}\b([-a-zA-Z0-9()@:;%_\+.~#?&//=]*))/g,
      '<a href="$1">$1</a>'
    )
    .replace(
      /\|\|(.+?)\|\|/g,
      `<span class="spoiler-text spoiler-text--hidden" ${
        replyStyle ? '' : 'onclick="showSpoiler(event, this)"'
      }>$1</span>`
    );
  if (message && message instanceof Message) {
    content = content
      .replace(
        /&lt;@!\d{18}&gt;/g,
        `<span class="mention preserve-whitespace">@${message.author.username}</span>`
      )
      .replace(/&lt;@&amp;(\d{18})&gt;/g, (match) => {
        const id = match.substring(10, 28);
        return `<span class="mention preserve-whitespace">@${
          message.guild?.roles.resolve(id)?.name
        }</span>`;
      })
      .replace(/&lt;#(\d{18})&gt;/g, (match) => {
        const id = match.substring(5, 23);
        const filterCat = message.guild?.channels.cache.some(
          (c) => c.type === 'GUILD_CATEGORY' && c.id === id
        );
        const channel = message.guild?.channels.cache.get(id);
        return `<span class="${
          filterCat ? '' : 'mention'
        } preserve-whitespace" ${
          filterCat
            ? ''
            : `onclick="gotoChannel(event, 'https://discord.com/channels/${
                message.guild?.id
              }/${channel?.id ?? ''}/')"`
        }>#${
          channel?.name ??
          message.guild?.channels.cache
            .filter((c) => c.type === 'GUILD_CATEGORY')
            .find((c) => c.id === id)?.name
        }</span>`;
      });
  }
  if (allowExtra) {
    content = content.replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2">$1</a>`);
  }

  return replyStyle
    ? content.replace(/(?:\r\n|\r|\n)/g, ' ')
    : content.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
