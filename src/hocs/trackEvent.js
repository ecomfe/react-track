import TrackEvent from '../components/TrackEvent';

export default ({...trackEventProps}) => ComponentIn => props => (
    <TrackEvent {...trackEventProps} >
        <ComponentIn {...props} />
    </TrackEvent>
);
