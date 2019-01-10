import {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {noop} from 'lodash';
import {createMemoizer} from '../utils';
import {Consumer} from './TrackerContext';

const trackEventCallback = (previousPropValue, tracker, category, action, label) => (...args) => {
    tracker.trackEvent({category, action, label});

    return previousPropValue(...args);
};

const createTrackedCallback = createMemoizer(trackEventCallback);

export default class TrackEvent extends Component {

    static displayName = 'TrackEvent'

    static propTypes = {
        eventPropName: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        action: PropTypes.string.isRequired,
        label: PropTypes.string,
        children: PropTypes.element.isRequired
    };

    static defaultProps = {
        label: null
    };

    renderChildren(tracker) {
        const {children, eventPropName, category, action, label, trackEvents = [], ...args} = this.props;

        if (!children || !children.props) {
            return children;
        }

        trackEvents.push({eventPropName, category, action, label});

        if (!children.type || children.type.displayName !== 'TrackEvent') {
            const callbacks = {}
            trackEvents.forEach(({eventPropName, category, action, label}) => {
                const callback = children.props[eventPropName] || noop;
                callbacks[eventPropName] = createTrackedCallback(callback, tracker, category, action, label);
            })
            return cloneElement(children, {...args, ...callbacks});
        }

        return cloneElement(children, {...args, trackEvents});
    }

    render() {

        return (
            <Consumer>
                {tracker => this.renderChildren(tracker)}
            </Consumer>
        );
    }
}
