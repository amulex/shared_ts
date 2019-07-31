import { Dict, Jsonable, MaybePromiseVoid, Primitive } from './type/type';

/**
 * For some reason Error class breaks prototype chain when extending from it.
 * Use this class as base error class instead of Error.
 */

export class FixedError extends Error {
  constructor(message?: string) {
    super(message);

    // We need to fix prototype chain when extending from Error
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Throws assertion error with given message if assertion is false.
 */
export const assert = (assertion: any, message: string = 'Assertion error.'): void => {
  if (!assertion) {
    throw new AssertionError(message);
  }
};

/**
 * Exception thrown by {@see assert}.
 */
export class AssertionError extends FixedError {}

export const noop = (...args: any[]): void => {};

export type JsonParseReviver = (key: any, value: any) => any;

/**
 * Transforms ISO dates to Date instance on JSON parsing.
 */
export const dateReviver: JsonParseReviver = (key, value) => (isIsoDate(value) ? new Date(value) : value);

export const jsonParseDefault = (str: string): Jsonable => JSON.parse(str, dateReviver);

const isoDateRegExp = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

const isIsoDate = (value: any): boolean => typeof value === 'string' && isoDateRegExp.test(value);

export const shallowMerge = <T, U>(source1: T, source2: U): T & U => Object.assign({}, source1, source2);

export const clone = <T>(source: T): T => shallowMerge(source, {});

/**
 * Logs with prefix, to be easy to distinguish own logs.
 */
export const log = (message: string, ...optionalParams: any[]): void =>
  console.log(`$$ ${new Date().toLocaleTimeString()} ${message}`, ...optionalParams);

/**
 * Creates procedure compatible with given procedures that calls each given procedure in order they passed.
 */
export const combineProcedures = <A extends any[]>(
  ...procedures: Array<(...args: A) => void>
): ((...args: A) => void) => (...args) => procedures.forEach(procedure => procedure(...args));

export const size = (obj: object): number => Object.keys(obj).length;

/**
 * Like Array.prototype.filter but for dictionaries.
 */
export const filterDictionary = <V>(dict: Dict<V>, predicate: (value: V, key: string) => boolean): Dict<V> => {
  const result: Dict<V> = {};

  for (const [key, value] of Object.entries(dict)) {
    if (predicate(value, key)) {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Like Array.prototype.map but for dictionaries.
 */
export const mapDictionary = <V, NV>(dict: Dict<V>, iteratee: (value: V, key: string) => [NV, string]): Dict<NV> => {
  const result: Dict<NV> = {};

  for (const [key, value] of Object.entries(dict)) {
    const [newValue, newKey] = iteratee(value, key);
    result[newKey] = newValue;
  }
  return result;
};

export const trace = <T>(label: string, value: T): T => {
  console.log(label, value);
  return value;
};

/**
 * Returns props of object if object is present and undefined otherwise.
 */
export const getProp = <T, K extends keyof T>(object: T | undefined, key: K): T[K] | undefined =>
  object === null || object === undefined ? undefined : object[key];

export const handleResultWith = <R, A extends any[]>(
  source: (...args: A) => Promise<R>,
  handle: (result: R) => MaybePromiseVoid,
) => async (...args: A): Promise<R> => {
  const result = await source(...args);
  await handle(result);
  return result;
};

export const setIfUndefined = <T>(object: Dict<T>, key: string, value: T): void => {
  if (object[key] === undefined) {
    object[key] = value;
  }
};

export const setIfValue = <T, K extends keyof T>(object: T, key: K, value: T[K] | undefined): void => {
  if (value) {
    object[key] = value;
  }
};

export const setIfObject = <T, K extends keyof T>(object: T | undefined, key: K, value: T[K]): void => {
  if (object) {
    object[key] = value;
  }
};

export const lazy = <T>(create: () => T): (() => T) => {
  let cache: T | undefined;

  return () => {
    if (!cache) {
      cache = create();
    }

    return cache;
  };
};

export const lazyAsync = <T>(create: () => Promise<T>): (() => Promise<T>) => {
  let cache: T | undefined;

  return async () => {
    if (!cache) {
      cache = await create();
    }

    return cache;
  };
};

export const decorateFirstArg = <A, R>(
  func: (firstArg: A) => R,
  decorator: (firstArg: A) => A,
): ((firstArg: A) => R) => firstArg => func(decorator(firstArg));

export const toBool = (value: any): boolean => !!value;

export const toString = (value: Primitive) => value + '';
