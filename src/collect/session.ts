import uuid from 'uuid/v4';
import {CollectGenerator} from '../types';

const getSessionKey = (key: string): string => {
    const storedValue = sessionStorage.getItem(key);

    if (storedValue) {
        return storedValue;
    }

    const newValue = uuid();
    sessionStorage.setItem(key, newValue);
    return newValue;
};

interface Session {
    session: string;
}

const session: CollectGenerator<Session> = (key: string = 'trackingVisitorSession') => () => ({
    session: getSessionKey(key),
});

export default session;
