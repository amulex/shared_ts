import {assert} from './util';

export const hide = (element: HTMLElement): void => {
    element.style.display = 'none';
};

export const show = (element: HTMLElement, display: string = 'block'): void => {
    element.style.display = display;
};

/**
 * querySelector only for existing HTMLElements, refines type for that case.
 */
export function query<K extends keyof ElementTagNameMap>(selector: K, root?: NodeSelector): ElementTagNameMap[K];
export function query(selector: string, root?: NodeSelector): HTMLElement;
export function query(selector: any, root: NodeSelector = document) {
    const element = queryMaybe(selector, root);
    assert(element, `Element wasn't found by selector: ${selector}`);
    return element!;
}

export function queryMaybe<K extends keyof ElementTagNameMap>(selector: K, root?: NodeSelector): ElementTagNameMap[K] | undefined;
export function queryMaybe(selector: string, root?: NodeSelector): HTMLElement | undefined;
export function queryMaybe(selector: any, root: NodeSelector = document) {
    const element = root.querySelector(selector);
    return element ? <HTMLElement>element : undefined;
}

/**
 * querySelectorAll only for HTMLElements, refines type for that case and converts node list to array.
 */
export function queryAll<K extends keyof ElementTagNameMap>(selector: K, root?: NodeSelector): ElementTagNameMap[K][];
export function queryAll(selector: string, root?: NodeSelector): HTMLElement[];
export function queryAll(selector: any, root: NodeSelector = document) {
    return Array.from(root.querySelectorAll(selector));
}

/**
 * cloneNode only for HTMLElements, refines type for that case.
 */
export const clone = (element: HTMLElement): HTMLElement =>
    <HTMLElement>element.cloneNode(true);

export const play = (element: HTMLMediaElement) => async (times: number = 1): Promise<void> => {
    const total = element.duration * times;
    const prevLoop = element.loop;

    element.loop = true;
    await element.play();

    setTimeout(() => {
        stop(element);
        element.loop = prevLoop;
    }, total * 1000);
};

export const stop = (element: HTMLMediaElement): void => {
    element.pause();
    element.currentTime = 0;
};
