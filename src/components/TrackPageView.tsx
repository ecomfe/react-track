import {useEffect, SFC, ReactElement} from 'react';
import {useRouteMatch, useLocation} from 'react-router-dom';
import {useTrackPageView} from '../context';

export interface TrackPageViewProps {
    children: ReactElement;
}

const TrackPageView: SFC<TrackPageViewProps> = ({children}) => {
    const trackPageView = useTrackPageView();
    const {path} = useRouteMatch();
    const location = useLocation();
    useEffect(
        () => trackPageView(location, {path}),
        [location, path, trackPageView]
    );

    return children;
};

export default TrackPageView;
