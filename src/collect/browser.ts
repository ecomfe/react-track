import platform from 'platform';
import {CollectGenerator, Browser} from '../types';

declare type BrowserReturnType = Browser | null;

export const browser: CollectGenerator<BrowserReturnType> = () => {
    const {ua, name, version, os} = platform.parse(navigator.userAgent);

    return type => {
        if (type !== 'pageView') {
            return null;
        }

        return {
            userAgent: ua,
            resolution: {
                width: screen.width,
                height: screen.height,
            },
            os: {
                family: os.family,
                version: os.version,
            },
            browser: {
                name: name,
                version: version,
            },
            language: navigator.language,
        } as Browser;
    };
};

export default browser;
