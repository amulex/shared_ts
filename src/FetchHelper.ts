import { FixedError } from './util';
import { Jsonable, MaybePromise } from './type/type';
import fetch from 'isomorphic-fetch';
import { Fetch, FetchUrl } from './type/http';

/**
 * Exception thrown by {@see createSuccessfulFetch} spawned functions.
 */
export class FailedFetch extends FixedError {
  constructor(readonly response: Response, message?: string) {
    super(message);
  }
}

export class FetchHelper {
  /**
   * Fetch API decorator that throws error if response code is not in allowable statuses (200-299).
   */
  public static successfulFetch = FetchHelper.createSuccessfulFetch((response: Response) => response.ok, fetch);

  /**
   * Creates a fetch API decorator that throws {@see FailedFetch} if response code is not in allowable statuses.
   */
  public static createSuccessfulFetch(successful: (r: Response) => MaybePromise<boolean>, decorated: Fetch): Fetch {
    return async (url, init?) => {
      const response = await decorated(url, init);

      if (await successful(response.clone())) {
        return response;
      }

      throw new FailedFetch(response, 'Fetch error');
    };
  }

  public static postJson(url: FetchUrl, data: Jsonable, decorated: Fetch = fetch): Promise<Response> {
    return decorated(url, {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  }

  /**
   * Merges header collections to the new header collection. Replaces conflicting headers by ones in the last collection.
   */
  public static mergeHeaders(...headerCollections: Array<Headers | object | undefined>): Headers {
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
  }

  /**
   * @param name In most cases you should postfix name with [], for example: ids[]
   * @param params
   * @param target
   */
  public static searchParamsAddArray(
    name: string,
    params: Array<string | number>,
    target: URLSearchParams = new URLSearchParams(),
  ): URLSearchParams {
    for (const param of params) {
      target.append(name, param.toString());
    }
    return target;
  }
}
