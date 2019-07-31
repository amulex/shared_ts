/**
 * For typing function that can be both async or not.
 */
export type MaybePromise<T> = Promise<T> | T;
export type MaybePromiseVoid = void | Promise<any>;

export type Dict<T> = { [K: string]: T };

export type Primitive = string | number | boolean | null | undefined;

export type DeepReadonly<T> = T extends Primitive | RegExp | ((...args: any) => any) | Array<infer U> | Node
  ? T
  : DeepReadonlyObject<T>;
type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type DeepPartial<T> = T extends Primitive | RegExp | ((...args: any) => any) | Array<infer U> | Node
  ? T
  : DeepPartialObject<T>;
type DeepPartialObject<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Refines types of Object methods.
 */
export const Obj = {
  keys: <T, K extends keyof T>(obj: T): K[] => {
    return Object.keys(obj) as K[];
  },
};

export type MimeType = string;
export type Email = string;
export type Base64 = string;

export type Jsonable = Exclude<any, undefined>;

type HandleEvent<E> = (event: E) => MaybePromiseVoid;
export type HandleMessage = HandleEvent<MessageEvent>;

/**
 * OpenViduRole from openvidu-node-client
 */
export enum OpenViduRole {
  SUBSCRIBER = 'SUBSCRIBER',
  PUBLISHER = 'PUBLISHER',
  MODERATOR = 'MODERATOR',
}

/**
 * RecordingMode from openvidu-node-client
 */
export enum RecordingMode {
  ALWAYS = 'ALWAYS',
}
