import {Consumer} from './TrackerContext';
import TrackPageView from './TrackPageView';

export default props => (
    <Consumer>
        {tracker => (<TrackPageView {...props} tracker={tracker} />)}
    </Consumer>
);
