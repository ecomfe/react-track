import React from 'react';
import {Route, RouteProps} from 'react-router-dom';
import TrackPageView from './TrackPageView';

const TrackRoute = ({render, children, component, ...props}: RouteProps) => (
    <Route {...props}>
        <TrackPageView>
            <Route render={render} component={component}>
                {children}
            </Route>
        </TrackPageView>
    </Route>
);

export default TrackRoute;
