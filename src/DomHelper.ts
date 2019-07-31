import { assert } from './util';

export class DomHelper {
  public static hide(element: HTMLElement): void {
    element.style.display = 'none';
  }

  public static show(element: HTMLElement, display: string = 'block'): void {
    element.style.display = display;
  }

  /**
   * querySelector only for existing HTMLElements, refines type for that case.
   */
  public static query<K extends keyof HTMLElementTagNameMap>(selector: K, root?: ParentNode): HTMLElementTagNameMap[K];
  public static query(selector: string, root?: ParentNode): HTMLElement;
  public static query(selector: any, root: ParentNode = document) {
    const element = this.queryMaybe(selector, root);
    assert(element, `Element wasn't found by selector: ${selector}`);
    return element!;
  }

  public static queryMaybe<K extends keyof HTMLElementTagNameMap>(
    selector: K,
    root?: ParentNode,
  ): HTMLElementTagNameMap[K] | undefined;
  public static queryMaybe(selector: string, root?: ParentNode): HTMLElement | undefined;
  public static queryMaybe(selector: any, root: ParentNode = document) {
    const element = root.querySelector(selector);
    return element ? (element as HTMLElement) : undefined;
  }

  /**
   * querySelectorAll only for HTMLElements, refines type for that case and converts node list to array.
   */
  public static queryAll<K extends keyof HTMLElementTagNameMap>(
    selector: K,
    root?: ParentNode,
  ): Array<HTMLElementTagNameMap[K]>;
  public static queryAll(selector: string, root?: ParentNode): HTMLElement[];
  public static queryAll(selector: any, root: ParentNode = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  /**
   * cloneNode only for HTMLElements, refines type for that case.
   */
  public static clone(element: HTMLElement): HTMLElement {
    return element.cloneNode(true) as HTMLElement;
  }

  public static async play(element: HTMLMediaElement) {
    return async (times: number = 1): Promise<void> => {
      const total = element.duration * times;
      const prevLoop = element.loop;

      element.loop = true;
      await element.play();

      setTimeout(() => {
        this.stop(element);
        element.loop = prevLoop;
      }, total * 1000);
    };
  }

  public static stop(element: HTMLMediaElement): void {
    element.pause();
    element.currentTime = 0;
  }
}
