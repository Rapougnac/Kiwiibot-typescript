import KiwiiClient from '../Client';
import { Options, SubOptions } from '../interfaces/main';

export default class CommandInteractionOptionResolver {
    /**
     * The client that instantiated this.
     * @name CommandInteractionOptionResolver#client
     */
    public readonly client!: KiwiiClient;
    /**
     * The interaction options array
     */
    private _options: Options[] | any;
    /**
     * The name of the sub command group
     */
    private _group: string | null;
    /**
     * The name of the sub-command
     */
    private _subCommand: string | null;
    /**
     * The arguments passed in
     */
    public args: Record<string, any>;
    constructor(client: KiwiiClient, options: Options[]) {
        Object.defineProperty(this, 'client', {
            value: client,
        });
        this._options = options ?? [];
        this._group = null;
        this._subCommand = null;

        if (
            (this._options[0]?.type as unknown as string) ===
            'SUB_COMMAND_GROUP'
        ) {
            this._group = this._options[0].name;
            this._options = (this._options[0].options as Options[]) ?? [];
        }
        if ((this._options[0]?.type as unknown as string) === 'SUB_COMMAND') {
            this._subCommand = this._options[0].name;
            this._options = (this._options[0].options as Options[]) ?? [];
        }
        this.args = {};
        if (this._options) {
            for (const option of this._options) {
                let { name, value } = option as unknown as SubOptions;
                if ((option.type as unknown as string) !== 'STRING')
                    value = option[name];
                this.args[name] = value;
            }
        }
    }
    get(name: string, required = false) {
        const option = this._options.find((opt: Options) => opt.name === name);
        if (!option) {
            if (required) {
                throw new TypeError('Command interaction not foud.');
            }
            return null;
        }
        return option;
    }
    /**
     * Gets the selected sub-command.
     * @returns The name of the selected sub-command.
     */
    getSubCommand(): string {
        if (!this._subCommand)
            throw new TypeError('SubCommand interaction not foud.');
        return this._subCommand;
    }
    /**
     * Gets the selected sub-command group.
     * @returns The name of the selected sub-command group.
     */
    getSubCommandGroup(): string {
        if (!this._group) {
            throw new TypeError('SubCommandGroup interaction not foud.');
        }
        return this._group;
    }
}
