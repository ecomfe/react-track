import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Consumer} from './TrackerContext';

class TrackPageViewCore extends Component {

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
    <Consumer>
        {tracker => (<TrackPageViewWithRouter {...props} tracker={tracker} />)}
    </Consumer>
);

export default TrackPageView;
