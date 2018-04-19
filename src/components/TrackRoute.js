import {Consumer} from './TrackerContext';
import TrackPageView from './TrackPageView';

const TrackRoute = props => (
    <Consumer>
        {tracker => <TrackPageView {...props} tracker={tracker} />}
    </Consumer>
);

export default TrackRoute;
