import {createContext, useContext} from 'react';
import {TrackerContext} from '../types';

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
