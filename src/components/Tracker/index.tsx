import {SFC, useRef, useEffect, useMemo} from 'react';
import {TrackerCollect, TrackerProvider, Location, PageView, Event, TrackerContext} from '../../types';
import {Provider} from '../../context';
import {useSafeTrackerProvider} from './hooks';

export interface TrackerProps {
    collect: TrackerCollect;
    provider: TrackerProvider;
}

const Tracker: SFC<TrackerProps> = ({collect, provider, children}) => {
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
