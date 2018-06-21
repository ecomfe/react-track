import {createElement} from 'react';
import TrackEvent from '../components/TrackEvent';

const getChildren = (ComponentIn, props) => {
    if (typeof ComponentIn === 'string') {
        return createElement(ComponentIn, props);
    }

    return <ComponentIn {...props} />;
};

export default ({...trackEventProps}) => ComponentIn => props => (
    <TrackEvent {...trackEventProps} >
        {getChildren(ComponentIn, props)}
    </TrackEvent>
);
