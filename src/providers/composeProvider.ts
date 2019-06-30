/**
 * @file 将多个Provider合并为一个
 * @author zhanglili
 */
import {TrackerProvider} from '../types';

export default (...providers: TrackerProvider[]): TrackerProvider => {
    const chain = (name: keyof TrackerProvider) => (...args: any[]) =>
        providers.forEach(provider => (provider[name] as (...args: any[]) => void)(...args));

    return {
        install: chain('install'),
        uninstall: chain('uninstall'),
        trackPageView: chain('trackPageView'),
        trackEvent: chain('trackEvent'),
    } as TrackerProvider;
};
