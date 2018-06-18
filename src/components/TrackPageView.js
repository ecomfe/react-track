import {Component} from 'react';
import {omit} from 'lodash';

export default class TrackPageView extends Component {

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
