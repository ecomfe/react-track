/**
 * @file 将多个Provider合并为一个
 * @author zhanglili
 */

export default (...providers) => {
    const chain = name => (...args) => providers.forEach(provider => provider[name](...args));

    return {
        install: chain('install'),
        uninstall: chain('uninstall'),
        trackPageView: chain('trackPageView'),
        trackEvent: chain('trackEvent')
    };
};
