import platform from 'platform';
import {CollectType, TrackerCollect} from '../interface';

export const browser = (): TrackerCollect => {
    const {ua, name, version, os} = platform.parse(navigator.userAgent);
    return (type: CollectType) => {
        if (type !== 'pageView') {
            return {};
        }

        return {
            userAgent: ua,
            resolution: {
                width: screen.width,
                height: screen.height,
            },
            os: {
                family: os!.family,
                version: os!.version,
            },
            browser: {
                name,
                version,
            },
            language: navigator.language,
        };
    };
};

export default browser;
