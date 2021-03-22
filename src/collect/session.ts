import uuid from 'uuid/v4';
import {TrackerCollect} from '../interface';

const getSessionKey = (key: string): string => {
    const storedValue = sessionStorage.getItem(key);

    if (storedValue) {
        return storedValue;
    }

    const newValue = uuid();
    sessionStorage.setItem(key, newValue);
    return newValue;
};

const session = (key: string = 'trackingVisitorSession'): TrackerCollect => () => ({session: getSessionKey(key)});

export default session;
