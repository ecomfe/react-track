import * as history from 'history';

export type Location = history.Location & {path: string};

export type CollectType = 'pageView' | 'event';

export interface TrackerCollect {
    (type: 'pageView', location: Location): {[key: string]: any};
    (type: 'event'): {[key: string]: any};
}

export interface PageView {
    [key: string]: any;
    location: Location;
    referrer: Location | null;
}

export interface Event {
    category: string;
    action: string;
    label?: string;
}

export interface TrackerProvider {
    install(): void;
    uninstall(): void;
    trackEvent(payload: Event): void;
    trackPageView(payload: PageView): void;
}

export interface TrackerContext {
    trackPageView(location: history.Location, match: {path: string}): void;
    trackEvent(event: Event): void;
}
