import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Consumer} from './TrackerContext';

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

const TrackPageViewWithRouter = withRouter(TrackPageView);

export default props => (
    <Consumer>
        {tracker => (<TrackPageViewWithRouter {...props} tracker={tracker} />)}
    </Consumer>
);
