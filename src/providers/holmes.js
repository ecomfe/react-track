/**
 * @file 百度统计的追踪实现
 * @author zhanglili
 */

const HOLMES_SCRIPT_SRC = 'https://hm.baidu.com/hm.js';

/* globals _hmt */
/* eslint-disable no-underscore-dangle, no-empty-function */

const formatURL = ({pathname, search, hash}) => {
    const parts = [
        pathname,
        search ? '?' + search : '',
        hash ? '#' + hash : '',
    ];

    return parts.join('');
};

export default site => {
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

        uninstall() {
        },

        trackPageView({location}) {
            _hmt.push(['_trackPageview', formatURL(location)]);
        },

        trackEvent({category, action, label}) {
            _hmt.push(['_trackEvent', category, action, label]);
        },
    };
};
