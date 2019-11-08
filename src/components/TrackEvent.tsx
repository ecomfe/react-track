import {cloneElement, ReactElement, useCallback, SFC, useMemo} from 'react';
import {Event} from '../types';
import {useTrackEvent} from '../context';

export interface TrackEventProps extends Event {
    eventPropName: string;
    children: ReactElement;
    events?: {[key: string]: Function};
}

const TrackEvent: SFC<TrackEventProps> = ({eventPropName, category, action, label, events, children}) => {
    const trackEvent = useTrackEvent();
    const eventProp = children.props[eventPropName];
    const wrappedEventProp = useCallback(
        (...args) => {
            trackEvent({category, action, label});
            eventProp && eventProp(...args);
        },
        [category, action, label, eventProp, trackEvent]
    );
    const nextEvents = useMemo(
        () => ({...events, [eventPropName]: wrappedEventProp}),
        [events, eventPropName, wrappedEventProp]
    );

    if (children.type === TrackEvent) {
        return cloneElement(children, {events: nextEvents});
    }

    return cloneElement(children, nextEvents);
};

export default TrackEvent;
