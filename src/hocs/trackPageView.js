import TrackPageView from '../components/TrackPageView';

export default ComponentIn => props => (
    <TrackPageView>
        <ComponentIn {...props} />
    </TrackPageView>
);
