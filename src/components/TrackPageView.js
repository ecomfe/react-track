import {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';
import {omit} from 'lodash';

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
        const childProps = omit(this.props, ['location', 'match', 'history', 'tracker']);

        return <Route {...childProps} />;
    }
}

export default withRouter(TrackPageView);
