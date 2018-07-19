import TrackPageView from '../components/TrackPageView';

export default ComponentIn => {
    const ComponentOut = props => (
        <TrackPageView>
            <ComponentIn {...props} />
        </TrackPageView>
    );

    ComponentOut.displayName = `trackPageView(${ComponentIn.displayName || ComponentIn.name || 'Unknown'})`;

    return ComponentOut;
};
