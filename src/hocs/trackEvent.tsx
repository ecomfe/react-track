import React, {ComponentType} from 'react';
import TrackEvent, {TrackEventPropeties} from '../components/TrackEvent';

export default ({...trackEventProps}: TrackEventPropeties) => (ComponentIn: ComponentType) => {
    const ComponentOut = props => (
        <TrackEvent {...trackEventProps}>
            <ComponentIn {...props} />
        </TrackEvent>
    );

    ComponentOut.displayName = `trackEvent(${ComponentIn.displayName || ComponentIn.name || 'Unknown'})`;

    return ComponentOut;
};
