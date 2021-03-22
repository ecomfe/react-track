/**
 * @file 空的跟踪实现
 * @author zhanglili
 */

import noop from 'lodash/noop';
import {TrackerProvider} from '../interface';

const provider: TrackerProvider = {
    install: noop,
    uninstall: noop,
    trackPageView: noop,
    trackEvent: noop,
};

export default /* istanbul ignore next */ () => provider;
