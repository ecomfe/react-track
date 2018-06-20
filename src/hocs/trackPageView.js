import TrackRoute from '../components/TrackRoute';

export default ComponentIn => props => (
    <TrackRoute>
        <ComponentIn {...props} />
    </TrackRoute>
);
