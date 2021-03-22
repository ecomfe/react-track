import {useRef, useMemo} from 'react';
import {TrackerProvider, Event, PageView} from '../../interface';

const usePreviousValue = <T>(value: T): T => {
    const previous = useRef(value);
    const previousValue = previous.current;
    previous.current = value;
    return previousValue;
};

interface MutableQueue<T> {
    push(paylod: T): void;
    flush(callback: (payload: T) => void): void;
}

export const useMutableQueue = <T>(): MutableQueue<T> => {
    const queue = useRef([] as T[]);
    const methods = useMemo(
        (): MutableQueue<T> => {
            return {
                push(payload) {
                    queue.current.push(payload);
                },
                flush(callback) {
                    for (const item of queue.current) {
                        callback(item);
                    }
                    queue.current.length = 0;
                },
            };
        },
        []
    );
    return methods;
};

const useEquals = <T>(value: T): boolean => {
    const previousValue = usePreviousValue(value);
    return previousValue === value;
};

export const useSafeTrackerProvider = (provider: TrackerProvider): TrackerProvider => {
    const pageViewQueue = useMutableQueue<PageView>();
    const eventQueue = useMutableQueue<Event>();
    const installed = useRef(false);
    const isProviderEquals = useEquals(provider);
    const safe = useMemo(
        (): TrackerProvider => {
            return {
                install() {
                    installed.current = true;
                    provider.install();
                    pageViewQueue.flush(provider.trackPageView);
                    eventQueue.flush(provider.trackEvent);
                },
                uninstall() {
                    provider.uninstall();
                },
                trackPageView(payload) {
                    if (installed.current) {
                        provider.trackPageView(payload);
                    }
                    else {
                        pageViewQueue.push(payload);
                    }
                },
                trackEvent(payload) {
                    if (installed.current) {
                        provider.trackEvent(payload);
                    }
                    else {
                        eventQueue.push(payload);
                    }
                },
            };
        },
        [provider, pageViewQueue, eventQueue]
    );

    if (!isProviderEquals) {
        installed.current = false;
    }

    return safe;
};
