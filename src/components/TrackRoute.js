import {Route} from 'react-router-dom';
import TrackPageView from './TrackPageView';

export default props => (
    <TrackPageView>
        <Route {...props} />
    </TrackPageView>
);
