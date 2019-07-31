// Types that used in HTTP requests and responses between typescript projects.

import {DeepReadonly, OpenViduRole, RecordingMode} from "./type";

export type CustomizableSessionOpts = {
    readonly recordingMode?: RecordingMode.ALWAYS
};

export type ConnectOptions = DeepReadonly<{
    record?: boolean,
    maxParticipants?: number,
    /**
     * Subset of:
     * @link https://openvidu.io/api/openvidu-node-client/interfaces/sessionproperties.html
     */
    session?: CustomizableSessionOpts & {
        readonly customSessionId?: string
    },
    /**
     * Subset of:
     * @link https://openvidu.io/api/openvidu-node-client/interfaces/tokenoptions.html
     */
    token?: {
        data?: string,
        role?: OpenViduRole
    }
}>;
