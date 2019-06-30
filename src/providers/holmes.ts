/**
 * @file 百度统计的追踪实现
 * @author zhanglili
 */
import {Location} from 'history';
import {TrackerProvider} from '../types';

const HOLMES_SCRIPT_SRC: string = 'https://hm.baidu.com/hm.js';

const formatURL = ({pathname, search, hash}: Location): string => {
    const parts = [pathname, search ? '?' + search : '', hash ? '#' + hash : ''];

    return parts.join('');
};

declare type HMT = [string, ...unknown[]];
declare const _hmt: HMT[];
declare global {
    interface Window {
        _hmt: HMT[];
    }
}

export default (site: string): TrackerProvider => {
    // The first time `hm.js`
    return {
        install() {
            if (typeof window._hmt === 'undefined') {
                window._hmt = [['_setAutoPageview', false]];

                const script = document.createElement('script');
                script.src = HOLMES_SCRIPT_SRC + '?' + site;
                document.head.appendChild(script);
            }
        },

        uninstall() {},

        trackPageView({location}) {
            _hmt.push(['_trackPageview', formatURL(location)]);
        },

        trackEvent({category, action, label}) {
            _hmt.push(['_trackEvent', category, action, label]);
        },
    } as TrackerProvider;
};
