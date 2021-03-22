import {cloneElement, ReactElement, useCallback, FC, useMemo} from 'react';
import {Event} from '../interface';
import {useTrackEvent} from './Tracker';

export interface TrackEventProps extends Event {
    eventPropName: string;
    children: ReactElement;
    // 这东西用于`TrackEvent`嵌套的内部实现，对外不使用
    events?: {[key: string]: Function}; // eslint-disable-line @typescript-eslint/ban-types
}

const TrackEvent: FC<TrackEventProps> = ({eventPropName, category, action, label, events, children}) => {
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
