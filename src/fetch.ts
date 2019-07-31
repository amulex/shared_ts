import {FixedError} from "./util";
import {Jsonable, MaybePromise} from "./type/type";
import fetch from "isomorphic-fetch";

type FetchUrl = string | Request;

export type Fetch = (url: FetchUrl, init?: RequestInit) => Promise<Response>;

/**
 * Creates a fetch API decorator that throws {@see FailedFetch} if response code is not in allowable statuses.
 */
export const createSuccessfulFetch = (successful: (r: Response) => MaybePromise<boolean>, decorated: Fetch): Fetch =>
    async (url, init?) => {
        const response = await decorated(url, init);

        if (await successful(response.clone())) {
            return response;
        }

        throw new FailedFetch(response, 'Fetch error');
    };

/**
 * Fetch API decorator that throws error if response code is not in allowable statuses (200-299).
 */
export const successfulFetch = createSuccessfulFetch((response: Response) => response.ok, fetch);

/**
 * Exception thrown by {@see createSuccessfulFetch} spawned functions.
 */
export class FailedFetch extends FixedError {
    constructor(readonly response: Response, message?: string) {
        super(message);
    }
}

export const postJson = (url: FetchUrl, data: Jsonable, decorated: Fetch = fetch): Promise<Response> =>
    decorated(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

/**
 * Merges header collections to the new header collection. Replaces conflicting headers by ones in the last collection.
 */
export const mergeHeaders = (...headerCollections: (Headers | object | undefined)[]): Headers => {
    const result = new Headers();

    for (const headers of headerCollections) {
        if (!headers) {
            continue;
        }

        const entries = headers instanceof Headers ? headers : Object.entries(headers);
        for (const [key, value] of entries) {
            result.set(key, value);
        }
    }

    return result;
};

/**
 * @param name In most cases you should postfix name with [], for example: ids[]
 */
export const searchParamsAddArray = (name: string, params: (string | number)[], target: URLSearchParams = new URLSearchParams()): URLSearchParams => {
    for (const param of params) {
        target.append(name, param.toString());
    }
    return target;
};
