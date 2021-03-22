import {useEffect, FC, ReactElement} from 'react';
import {useRouteMatch, useLocation} from 'react-router-dom';
import {useTrackPageView} from './Tracker';

interface Props {
    disabled?: boolean;
    children: ReactElement;
}

const TrackPageView: FC<Props> = ({disabled = false, children}) => {
    const trackPageView = useTrackPageView();
    const {path} = useRouteMatch();
    const location = useLocation();
    useEffect(
        () => {
            if (!disabled) {
                trackPageView(location, {path});
            }
        },
        [location, path, trackPageView, disabled]
    );

    return children;
};

export default TrackPageView;
