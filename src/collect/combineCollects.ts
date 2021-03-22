import {TrackerCollect, CollectType, Location} from '../interface';

const combineCollect = (...collects: TrackerCollect[]): TrackerCollect => {
    return (type: CollectType, location?: Location) => collects.reduce(
        (result, collect) => {
            const data = type === 'event' ? collect('event') : collect('pageView', location as Location);
            return {...result, ...data};
        },
        {}
    );
};

export default combineCollect;
