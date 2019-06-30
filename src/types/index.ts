import {Location} from 'history';
import {match} from 'react-router';

export interface Browser {
    userAgent: string;
    resolution: {
        width: number;
        height: number;
    };
    os: {
        family: string;
        version: string;
    };
    browser: {
        name: string;
        version: string;
    };
    language: string;
}

export declare type CollectGenerator<Collection> = (...args: unknown[]) => TrackerCollect<Collection>;

export declare type TrackerCollect<Collection> = (...args: unknown[]) => Collection;

export interface TrackerProvider {
    install?: () => void;
    uninstall?: () => void;
    trackEvent?: (data: CollectEvent) => void;
    trackPageView?: <Collect>(data: CollectLocation & Collect, match?: match) => void;
}

export interface CollectLocation extends Location {
    path?: string;
    location: CollectLocation;
    referrer: CollectLocation;
}

export interface CollectEvent {
    category: string;
    action: string;
    label?: string;
}
