/**
 * @file 控制台打印的跟踪实现
 * @author zhanglili
 */

import {noop} from 'lodash';

/* eslint-disable no-console */
export default () => {
    return {
        install: noop,

        uninstall: noop,

        trackPageView(data) {
            console.log(data);
        },

        trackEvent(data) {
            console.log(data);
        }
    };
};
