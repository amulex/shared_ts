import {combineProcedures, noop} from "./util";

export class WebRtcHelper {

    public static sendNowOrOnOpen(channel: RTCDataChannel, data: Parameters<RTCDataChannel['send']>[0]): void {
        if (channel.readyState === 'open') {
            channel.send(data);
        } else {
            channel.onopen = combineProcedures<[Event]>(channel.onopen || noop, () => channel.send(data));
        }
    };
}