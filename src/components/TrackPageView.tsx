import {Component} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {Consumer} from './TrackerContext';
import {TrackerProvider} from '../types';

interface TrackPageViewCoreProperties extends RouteComponentProps {
    tracker: TrackerProvider;
}

class TrackPageViewCore extends Component<TrackPageViewCoreProperties> {
    componentDidMount() {
        this.trackPageView();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location) {
            this.trackPageView();
        }
    }

    trackPageView() {
        const {location, match, tracker} = this.props;

        tracker.trackPageView(location, match);
    }

    render() {
        return this.props.children;
    }
}

const TrackPageViewWithRouter = withRouter(TrackPageViewCore);

const TrackPageView = props => (
    <Consumer>{tracker => <TrackPageViewWithRouter {...props} tracker={tracker} />}</Consumer>
);

export default TrackPageView;
