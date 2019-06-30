import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createMemoizer} from '../utils';
import {Provider} from './TrackerContext';
import {TrackerCollect, TrackerProvider, CollectLocation} from '../types';

const createLazyProvider = (inner: TrackerProvider): TrackerProvider => {
    let installed: boolean = false;
    const queue: Array<[keyof TrackerProvider, any]> = [];

    const queueBeforeInstall = (name: keyof TrackerProvider) => (...args: any[]) => {
        if (installed) {
            (inner[name] as ((...args: any[]) => void))(...args);
        }
        else {
            queue.push([name, args]);
        }
    };

    return {
        install() {
            inner.install!();
            installed = true;

            for (const [name, args] of queue) {
                (inner[name] as ((...args: any[]) => void))(...args);
            }

            queue.length = 0;
        },
        uninstall() {
            inner.uninstall!();
            queue.length = 0;
        },
        trackPageView: queueBeforeInstall('trackPageView'),
        trackEvent: queueBeforeInstall('trackEvent'),
    };
};

const createTrackerContext = (collect: TrackerCollect<CollectLocation>, provider: TrackerProvider): TrackerProvider => {
    let currentLocation: CollectLocation = null as unknown as CollectLocation;

    return {
        trackPageView(location, match) {
            const path = match!.path;
            const referrer = currentLocation;
            currentLocation = {...location, path};
            const data = {
                ...collect('pageView', location),
                referrer,
                location: currentLocation,
            };

            provider.trackPageView!(data);
        },

        trackEvent(event) {
            const data = {
                ...collect('event'),
                ...event,
            };

            provider.trackEvent!(data);
        },
    };
};

interface TrackerProperties {
    collect: TrackerCollect<unknown>;
    provider: TrackerProvider;
}

interface TrackerStates {
    sourceProvider: TrackerProvider;
    provider: TrackerProvider;
}

class Tracker extends Component<TrackerProperties, TrackerStates> {
    static propTypes = {
        collect: PropTypes.func.isRequired,
        provider: PropTypes.object.isRequired,
    };

    state = {
        sourceProvider: null as unknown as TrackerProvider,
        provider: null as unknown as TrackerProvider,
    };

    getTracker = createMemoizer(createTrackerContext);

    getProvider = createMemoizer(createLazyProvider);

    static getDerivedStateFromProps({provider}: TrackerProperties, {sourceProvider}: TrackerStates) {
        if (provider === sourceProvider) {
            return null;
        }

        return {
            sourceProvider: provider,
            provider: createLazyProvider(provider),
        };
    }

    componentDidMount() {
        const {provider} = this.state;

        provider.install!();
    }

    /* istanbul ignore next line */
    componentDidUpdate(prevProps: TrackerProperties) {
        const {provider} = this.props;

        if (provider !== prevProps.provider) {
            prevProps.provider.uninstall!();
            provider.install!();
        }
    }

    componentWillUnmount() {
        const {provider} = this.state;

        provider.uninstall!();
    }

    render() {
        const {collect, children} = this.props;
        const {provider} = this.state;
        const tracker = this.getTracker(collect, provider);

        return <Provider value={tracker}>{children}</Provider>;
    }
}

export default Tracker;
