import {SFC} from 'react';
import {Route, RouteProps} from 'react-router-dom';
import TrackPageView from './TrackPageView';

const TrackRoute: SFC<RouteProps> = ({render, children, component, ...props}) => (
    <Route {...props}>
        <TrackPageView>
            <Route render={render} component={component}>
                {children}
            </Route>
        </TrackPageView>
    </Route>
);

export default TrackRoute;
