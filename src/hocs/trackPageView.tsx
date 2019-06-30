import {ComponentType} from 'react';
import TrackPageView from '../components/TrackPageView';

export default (ComponentIn: ComponentType) => {
    const ComponentOut = props => (
        <TrackPageView>
            <ComponentIn {...props} />
        </TrackPageView>
    );

    ComponentOut.displayName = `trackPageView(${ComponentIn.displayName || ComponentIn.name || 'Unknown'})`;

    return ComponentOut;
};
