/**
 * @file 空的跟踪实现
 * @author zhanglili
 */

import {noop} from 'lodash';

const provider = {
    install: noop,
    uninstall: noop,
    trackPageView: noop,
    trackEvent: noop,
};

export default () => provider;
