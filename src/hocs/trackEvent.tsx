import {ComponentType, FC} from 'react';
import TrackEvent from '../components/TrackEvent';
import {Event} from '../interface';

export interface TrackEventOptions extends Event {
    eventPropName: string;
}

export default (options: TrackEventOptions) => {
    function wrap<P>(ComponentIn: ComponentType<P>): FC<P> {
        const ComponentOut = (props: P) => (
            <TrackEvent {...options}>
                <ComponentIn {...props} />
            </TrackEvent>
        );

        ComponentOut.displayName = `trackEvent(${ComponentIn.displayName || ComponentIn.name || 'Unknown'})`;

        return ComponentOut;
    }

    return wrap;
};
