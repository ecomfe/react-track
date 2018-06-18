import {Route, withRouter} from 'react-router-dom';
import {Consumer} from './TrackerContext';
import TrackPageView from './TrackPageView';

const TrackPageRoute = withRouter(TrackPageView);

export default props => (
    <Consumer>
        {tracker => (<TrackPageRoute {...props} tracker={tracker} ComponentIn={Route} />)}
    </Consumer>
);
