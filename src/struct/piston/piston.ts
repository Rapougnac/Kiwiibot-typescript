import get from './util/get';
import post from './util/post';
import or from './util/or';

const defaultServer = 'https://emkc.org';

interface Piston {
    /**
     * The server to connect to.
     */
    server?: string;
}

export interface Runtimes {
    /**
     * The language to run the code in.
     */
    language: string;

    /**
     * The version of the language to run the code in.
     */
    version: string;

    /**
     * The language aliases to run the code in.
     */
    aliases: string[];
}

/**
 * The output of an execute request.
 */
interface Output {
    /**
     * The language the output is in.
     */
    language: string;

    /**
     * The run of the output.
     */
    run: Run;

    /**
     * The version of the language the output is in.
     */
    version: string;
}

/**
 * The output of a run request.
 */
interface Run {
    /**
     * The stdout of the run.
     */
    stdout: string;

    /**
     * The exit code of the run.
     */
    code: number;

    /**
     * The signal that terminated the run.
     */
    signal: string | null;

    /**
     * The stderr of the run.
     */
    stderr: string;

    /**
     * The output of the run.
     */
    output: string;
}

interface PistonOutput {
    /**
     * Get the runtimes of the piston.
     */
    runtimes(): Promise<Runtimes[]>;

    /**
     * Execute the code in the specified language.
     * @param language The language to run the code in.
     * @param code The code to run.
     * @param args The arguments to pass to the code.
     */
    execute(
        language: string,
        code: string,
        args?: object | null
    ): Promise<Output>;
}

const store: {
    runtimes?: Runtimes[];
} = {};

/**
 * The Piston API.
 * @param opts The options to use.
 * @returns The piston instance.
 */
export const piston = (opts: Piston = {}): PistonOutput => {
    const server = String(opts.server || defaultServer).replace(/\/$/, '');

    const api = {
        async runtimes(): Promise<Runtimes[]> {
            if (store.runtimes?.length !== 0 && Array.isArray(store.runtimes)) {
                return store.runtimes;
            }
            const suffix =
                server === defaultServer
                    ? '/api/v2/piston/runtimes'
                    : '/api/v2/runtimes';
            const url = `${server}${suffix}`;
            const runtimes = await get(url);
            if (runtimes && Array.isArray(runtimes)) {
                store.runtimes = runtimes;
            } else if (runtimes.success === false) {
                throw new Error(String(runtimes.error));
            }
            return Array.isArray(runtimes) ? runtimes : [];
        },

        async execute(
            argA: string,
            argB: string,
            argC: object | null = null
        ): Promise<Output> {
            const runtimes = await api.runtimes();
            if (!Array.isArray(runtimes)) {
                return runtimes;
            }

            const config: {
                language?: string;
                version?: string;
                aliases?: string[];
                files?: string[];
                stdin?: string;
                args?: string[];
                compileTimeout?: number;
                runTimeout?: number;
                compileMemoryLimit?: number;
                runMemoryLimit?: number;
            } =
                typeof argA === 'object'
                    ? argA
                    : typeof argB === 'object'
                    ? argB
                    : argC || {};
            let language = typeof argA === 'string' ? argA : undefined;
            language = language || config.language;
            const code = typeof argB === 'string' ? argB : undefined;
            const latestVersion = (
                runtimes
                    .filter((n) => n.language === language)
                    .sort((a, b) => {
                        return a.version > b.version
                            ? -1
                            : b.version > a.version
                            ? 1
                            : 0;
                    })[0] || {}
            ).version;

            const boilerplate = {
                language: language,
                version: config.version || latestVersion,
                files: or(config.files, [
                    {
                        content: code,
                    },
                ]),
                stdin: or(config.stdin, ''),
                args: or(config.args, ['1', '2', '3']),
                compile_timeout: or(config.compileTimeout, 10000),
                run_timeout: or(config.runTimeout, 3000),
                compile_memory_limit: or(config.compileMemoryLimit, -1),
                run_memory_limit: or(config.runMemoryLimit, -1),
            };

            const suffix =
                server === defaultServer
                    ? '/api/v2/piston/execute'
                    : '/api/v2/execute';
            const url = `${server}${suffix}`;
            return await post(url, boilerplate);
        },
    };

    return api;
};

export default piston;
