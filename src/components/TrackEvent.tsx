import React, {Component, cloneElement, ReactElement} from 'react';
import PropTypes from 'prop-types';
import {noop} from 'lodash';
import {createMemoizer} from '../utils';
import {Consumer} from './TrackerContext';
import {TrackerProvider, CollectEvent} from '../types';

const trackEventCallback = (
    previousPropValue: (...args: unknown[]) => void,
    tracker: TrackerProvider,
    category: string,
    action: string,
    label: string
) => (...args: unknown[]) => {
    tracker.trackEvent({category, action, label});

    return previousPropValue(...args);
};

const createTrackedCallback = createMemoizer(trackEventCallback);

export interface TrackEventPropeties extends CollectEvent {
    eventPropName: string;
    children: ReactElement;
}

export default class TrackEvent extends Component<TrackEventPropeties> {
    static propTypes = {
        eventPropName: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        action: PropTypes.string.isRequired,
        label: PropTypes.string,
        children: PropTypes.element.isRequired,
    };

    static defaultProps = {
        label: null,
    };

    renderChildren(tracker) {
        const {children, eventPropName, category, action, label, ...args} = this.props;

        /* istanbul ignore next line */
        if (!children || !children.props) {
            return children;
        }

        const callback = children.props[eventPropName] || noop;
        const trackedCallback = createTrackedCallback(callback, tracker, category, action, label);

        return cloneElement(children, {...args, [eventPropName]: trackedCallback});
    }

    render() {
        return <Consumer>{tracker => this.renderChildren(tracker)}</Consumer>;
    }
}
