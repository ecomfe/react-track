/**
 * @file 控制台打印的跟踪实现
 * @author zhanglili
 */

import {noop} from 'lodash';
import {Location, TrackerProvider} from '../types';

const formatURL = ({pathname, search, hash, path}: Location): string => {
    const parts = [
        pathname,
        search ? '?' + search : '',
        // hash不需要加#号
        hash ? hash : '',
    ];

    return parts.join('') + '(' + path + ')';
};

/* eslint-disable no-console */
export default (): TrackerProvider => {
    return {
        install: noop,

        uninstall: noop,

        trackPageView({location, referrer}) {
            if (referrer) {
                console.log(`[Track] Move from ${formatURL(referrer)} to ${formatURL(location)}`);
            }
            else {
                console.log(`[Track] Move to ${formatURL(location)}`);
            }
        },

        trackEvent({category, action, label}) {
            console.log(`[Track] Receive custom event ${category}:${action}:${label}`);
        },
    } as TrackerProvider;
};
