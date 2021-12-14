import fetch from 'node-fetch';
import type { Runtimes } from '../piston';

export const get = async (
    url: string
): Promise<Runtimes[] | { success: boolean; error: unknown }> => {
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (e) {
        return Promise.reject({ success: false, error: e });
    }
};

export default get;
