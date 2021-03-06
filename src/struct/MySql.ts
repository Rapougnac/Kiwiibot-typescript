/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import mysql from 'mysql2/promise';
import type { Connection, ConnectionOptions } from 'mysql2/promise';
import { error, success } from '../util/console';

export default class MYSql {
  private _connection!: Connection;
  private _options: ConnectionOptions;
  public etablishedConnection: boolean | null;
  public connected: boolean;
  constructor(
    { host, password, user, database, port }: ConnectionOptions = {
      host: 'localhost',
      password: '',
      user: '',
    }
  ) {
    this.connected = false;
    this._options = { host, password, user, database, port };
    this.etablishedConnection = null;
    (async () => {
      this._connection = await this.createConnection();
    })()
      .then(() => {
        success('Connected to MySql', 'MySql');
        this.connected = true;
      })
      .catch((e) => {
        error(e, 'MySql');
        this.connected = false;
      });
    if (!this._connection) this.connected = false;
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
      this.connected = false;
    }
  }
}
