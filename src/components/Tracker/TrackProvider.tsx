import {FC, useRef, useEffect, useMemo, createContext, useContext, ReactNode} from 'react';
import {TrackerCollect, TrackerProvider, Location, PageView, Event, TrackerContext} from '../../interface';
import {useSafeTrackerProvider} from './hooks';

const EMPTY: TrackerContext = {
    trackPageView() { // eslint-disable-line @typescript-eslint/no-empty-function
    },
    trackEvent() { // eslint-disable-line @typescript-eslint/no-empty-function
    },
};

const Context = createContext(EMPTY);
Context.displayName = 'TrackerContext';

export const Provider = Context.Provider;

export const useTrackPageView = () => {
    const context = useContext(Context);
    return context.trackPageView;
};

export const useTrackEvent = () => {
    const context = useContext(Context);
    return context.trackEvent;
};


export interface TrackerProps {
    collect: TrackerCollect;
    provider: TrackerProvider;
    children: ReactNode;
}

const Tracker: FC<TrackerProps> = ({collect, provider, children}) => {
    const safeProvider = useSafeTrackerProvider(provider);
    const currentLocation = useRef<Location | null>(null);
    const trackerContext = useMemo(
        (): TrackerContext => {
            return {
                trackPageView(location, match) {
                    const path = match.path;
                    const referrer = currentLocation.current;
                    currentLocation.current = {...location, path};
                    const data: PageView = {
                        referrer,
                        location: currentLocation.current,
                        ...collect('pageView', currentLocation.current),
                    };
                    safeProvider.trackPageView(data);
                },
                trackEvent(event) {
                    const data: Event = {
                        ...collect('event'),
                        ...event,
                    };
                    safeProvider.trackEvent(data);
                },
            };
        },
        [safeProvider, collect]
    );
    useEffect(
        () => {
            safeProvider.install();
            return () => safeProvider.uninstall();
        },
        [safeProvider]
    );

    return <Provider value={trackerContext}>{children}</Provider>;
};

export default Tracker;
