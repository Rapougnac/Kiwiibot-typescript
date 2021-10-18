import KiwiiClient from "../../struct/Client";
import Command from "../../struct/Command";

export default class ServerInfoCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'serverinfo',
        });
    }
}