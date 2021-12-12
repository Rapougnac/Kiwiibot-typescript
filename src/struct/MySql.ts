import mysql, { Connection } from 'mysql2/promise';
import { MySqlOptions } from './interfaces/MySql';
import { error, success } from '../util/console';

export default class MYSql {
    private _connection!: Connection;
    private _options: MySqlOptions;
    public etablishedConnection: boolean | null;
    constructor(
        { host, password, user, database }: MySqlOptions = {
            host: 'localhost',
            password: '',
            user: 'root',
        }
    ) {
        this._options = { host, password, user, database };
        this.etablishedConnection = null;
        (async () => {
            this._connection = await this.createConnection();
        })()
            .then(() => success('Connected to MySql', 'MySql'))
            .catch(error);
    }

    private async createConnection() {
        const connection = await mysql.createConnection(this._options);
        this.etablishedConnection = true;
        return connection;
    }

    get connection(): Connection {
        return this._connection;
    }

    public dropConnection() {
        if (this._connection) {
            this._connection.end().catch(error);
        }
    }
}
