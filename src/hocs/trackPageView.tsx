import React, {ComponentType, FC} from 'react';
import TrackPageView from '../components/TrackPageView';

export default function wrap<P>(ComponentIn: ComponentType<P>): FC<P> {
    const ComponentOut = (props: any) => (
        <TrackPageView>
            <ComponentIn {...props} />
        </TrackPageView>
    );

    ComponentOut.displayName = `trackPageView(${ComponentIn.displayName || ComponentIn.name || 'Unknown'})`;

    return ComponentOut;
}
