import {Component} from 'react';
import {omit} from 'lodash';
import {Consumer} from '../components/TrackerContext';

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
        const childProps = omit(this.props, ['location', 'match', 'history']);
        const {ComponentIn} = this.props;

        return <ComponentIn {...childProps} />;
    }
}

export default ComponentIn => props => (
    <Consumer>
        {tracker => <TrackPageView {...props} ComponentIn={ComponentIn} tracker={tracker} />}
    </Consumer>
);
