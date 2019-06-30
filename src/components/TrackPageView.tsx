import React, {Component} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {Consumer} from './TrackerContext';
import {TrackerProvider, CollectLocation} from '../types';

interface TrackPageViewCoreProperties extends RouteComponentProps {
    tracker: TrackerProvider;
}

class TrackPageViewCore extends Component<TrackPageViewCoreProperties> {
    componentDidMount() {
        this.trackPageView();
    }

    componentDidUpdate(prevProps: TrackPageViewCoreProperties) {
        if (prevProps.location !== this.props.location) {
            this.trackPageView();
        }
    }

    trackPageView() {
        const {location, match, tracker} = this.props;

        tracker.trackPageView!(location as CollectLocation, match);
    }

    render() {
        return this.props.children;
    }
}

const TrackPageViewWithRouter = withRouter(TrackPageViewCore);

const TrackPageView = (props: any) => (
    <Consumer>{tracker => <TrackPageViewWithRouter {...props} tracker={tracker} />}</Consumer>
);

export default TrackPageView;
