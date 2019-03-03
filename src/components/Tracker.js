import {Component} from 'react';
import PropTypes from 'prop-types';
import {createMemoizer} from '../utils';
import {Provider} from './TrackerContext';

const createLazyProvider = inner => {
    let installed = false;
    const queue = [];

    const queueBeforeInstall = name => (...args) => {
        if (installed) {
            inner[name](...args);
        }
        else {
            queue.push([name, args]);
        }
    };

    return {
        install() {
            inner.install();
            installed = true;

            for (const [name, args] of queue) {
                inner[name](...args);
            }

            queue.length = 0;
        },
        uninstall() {
            inner.uninstall();
            queue.length = 0;
        },
        trackPageView: queueBeforeInstall('trackPageView'),
        trackEvent: queueBeforeInstall('trackEvent'),
    };
};

const createTrackerContext = (collect, provider) => {
    let currentLocation = null;

    return {
        trackPageView(location, {path}) {
            const referrer = currentLocation;
            currentLocation = {...location, path};
            const data = {
                ...collect('pageView', location),
                referrer: referrer,
                location: currentLocation,
            };

            provider.trackPageView(data);
        },

        trackEvent(event) {
            const data = {
                ...collect('event'),
                ...event,
            };

            provider.trackEvent(data);
        },
    };
};

class Tracker extends Component {

    static propTypes = {
        collect: PropTypes.func.isRequired,
        provider: PropTypes.object.isRequired,
    };

    state = {
        sourceProvider: null,
        provider: null,
    };

    getTracker = createMemoizer(createTrackerContext);

    getProvider = createMemoizer(createLazyProvider);

    static getDerivedStateFromProps({provider}, {sourceProvider}) {
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

        provider.install();
    }

    componentDidUpdate(prevProps) {
        const {provider} = this.props;

        if (provider !== prevProps.provider) {
            prevProps.provider.uninstall();
            provider.install();
        }
    }

    componentWillUnmount() {
        const {provider} = this.state;

        provider.uninstall();
    }

    render() {
        const {collect, children} = this.props;
        const {provider} = this.state;
        const tracker = this.getTracker(collect, provider);

        return (
            <Provider value={tracker}>
                {children}
            </Provider>
        );
    }
}

export default Tracker;
