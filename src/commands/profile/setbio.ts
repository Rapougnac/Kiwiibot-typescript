import type { Message } from 'discord.js';
import type { OkPacket } from 'mysql2';
import type KiwiiClient from '../../struct/Client';
import Command from '../../struct/Command';

export default class SetProfileCommand extends Command {
  constructor(client: KiwiiClient) {
    super(client, {
      name: 'setbio',
      description: 'Set your profile banner.',
      aliases: ['set-bio', 'setbiography'],
      utilisation: '{prefix}setbio [bio]',
      category: 'profile',
      clientPermissions: [
        'ATTACH_FILES',
        'EMBED_LINKS',
        'SEND_MESSAGES',
        'VIEW_CHANNEL',
      ],
    });
  }

  public override async execute(
    _client: KiwiiClient,
    message: Message,
    args: string[]
  ) {
    const newBio = args.join(' ');
    if (!newBio) return message.channel.send('Please provide a bio.');
    if (newBio.length > 180) {
      return message.channel.send(
        `Your bio is too long. It must be less than 180 characters.`
      );
    }
    const [[oldBio]] = (await this.client.mySql.connection.query(
      'SELECT bio FROM usersettings WHERE id = ?',
      [message.author.id]
    )) as unknown as [
      [
        {
          bio?: string;
        }?
      ]
    ];
    if (oldBio?.bio === newBio) {
      return message.channel.send(`Your bio is already set to ${newBio}`);
    }
    const data = await this.client.mySql.connection.query(
      'UPDATE usersettings SET bio = ? WHERE id = ?',
      [newBio, message.author.id]
    );
    if (!(data[0] as OkPacket).changedRows) {
      await this.client.mySql.connection.query(
        'INSERT INTO usersettings (id, bio) VALUES (?, ?)',
        [message.author.id, newBio]
      );
    }

    return message.channel.send(`Your bio has been set.`);
  }
}
