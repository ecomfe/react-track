import {CollectType, Location, TrackerCollect} from '../types';

export const basename = (name: string): TrackerCollect => {
    // only process when receiving a non-empty string which starts without /
    const prefix = /^[^/]/.test(name) ? '/' + name : name;

    return (type: CollectType, location?: Location) => {
        if (type !== 'pageView' || !location) {
            return {};
        }

        return {
            location: {
                ...location,
                pathname: prefix + location.pathname,
                path: prefix + location.path,
            },
        };
    };
};

export default basename;
