import {Consumer} from '../components/TrackerContext';
import TrackPageView from '../components/TrackPageView';

export default ComponentIn => props => (
    <Consumer>
        {tracker => <TrackPageView {...props} ComponentIn={ComponentIn} tracker={tracker} />}
    </Consumer>
);
