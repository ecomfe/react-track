import TrackEvent from '../components/TrackEvent';

export default ({...trackEventProps}) => ComponentIn => {
    const ComponentOut = props => (
        <TrackEvent {...trackEventProps} >
            <ComponentIn {...props} />
        </TrackEvent>
    );

    ComponentOut.displayName = `trackEvent(${ComponentIn.displayName || ComponentIn.name || 'Unknown'})`;

    return ComponentOut;
};
