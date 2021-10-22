import KiwiiClient from "../../struct/Client";
import Command from "../../struct/Command";

export default class AutoNOU extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'no-u',
            aliases: ['no-you'],
            description: 'no u',
            category: 'auto',
            hidden: true,
        });
    }
    public execute() {
        this.message!.channel.send('no u');
    }
}