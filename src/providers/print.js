/**
 * @file 控制台打印的跟踪实现
 * @author zhanglili
 */

import {noop} from 'lodash';

const formatURL = ({pathname, search, hash}) => {
    const parts = [
        pathname,
        search ? '?' + search : '',
        hash ? '#' + hash : ''
    ];

    return parts.join('');
};

/* eslint-disable no-console */
export default () => {
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
        }
    };
};
