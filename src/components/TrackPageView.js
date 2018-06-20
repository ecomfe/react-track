import {Component} from 'react';
import {withRouter} from 'react-router-dom';

class TrackPageView extends Component {

    componentDidMount() {
        this.trackPageView();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location) {
            this.trackPageView();
        }
    }

    trackPageView() {
        const {location, tracker} = this.props;

        tracker.trackPageView(location);
    }

    render() {
        return this.props.children;
    }
}

export default withRouter(TrackPageView);
