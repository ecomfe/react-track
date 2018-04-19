import {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider} from './TrackerContext';

const createTrackerContext = (collect, provider) => {
    let currentLocation = null;

    return {
        trackPageView(location) {
            const referrer = currentLocation;
            currentLocation = location;
            const data = {
                ...collect('pageView', location),
                referrer,
                location
            };

            provider.trackPageView(data);
        },

        trackEvent(event) {
            const data = {
                ...collect('event'),
                ...event
            };

            provider.trackEvent(data);
        }
    };
};

class Tracker extends Component {

    static propTypes = {
        collect: PropTypes.func.isRequired,
        provider: PropTypes.object.isRequired
    };

    tracker = null;

    componentDidMount() {
        const {provider} = this.props;

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
        const {provider} = this.props;

        provider.uninstall();
    }

    render() {
        const {collect, provider, children} = this.props;
        const tracker = createTrackerContext(collect, provider);

        return (
            <Provider value={tracker}>
                {children}
            </Provider>
        );
    }
}

export default Tracker;
