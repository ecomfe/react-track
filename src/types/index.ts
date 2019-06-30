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

export declare type CollectGenerator<Collection> = (...args: any[]) => TrackerCollect<Collection>;

export declare type TrackerCollect<Collection> = (...args: any[]) => Collection;

export declare type TrackEventInProvider = (data: CollectEvent) => void;

export declare type TrackPageViewInProvider = <Collect>(
    data: CollectLocation & Collect,
    match?: match & {path: string}
) => void;

export declare type TrackExecute = TrackEventInProvider | TrackPageViewInProvider;

export interface TrackerProvider {
    install?: () => void;
    uninstall?: () => void;
    trackEvent?: TrackEventInProvider;
    trackPageView?: TrackPageViewInProvider;
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
