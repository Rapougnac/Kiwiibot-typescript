import fetch from 'node-fetch';

export const post = async (
    url: string,
    body: object,
): Promise<any | { success: boolean; error: unknown }> => {
    try {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return await res.json();
    } catch (e) {
        return Promise.reject({ success: false, error: e });
    }
};

export default post;
