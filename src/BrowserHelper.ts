import {MaybePromiseVoid} from "./type/type";

export class BrowserHelper {

    public static async notifyIfPossible (notify: () => MaybePromiseVoid): Promise<void> {
        if (typeof Notification === 'undefined') {
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            return notify();
        }
    };

}