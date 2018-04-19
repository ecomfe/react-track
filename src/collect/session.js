import uuid from 'uuid/v4';

const getSessionKey = key => {
    const storedValue = sessionStorage.getItem(key);

    if (storedValue) {
        return storedValue;
    }

    const newValue = uuid();
    sessionStorage.setItem(key, newValue);
    return newValue;
};

export default (key = 'trackingVisitorSession') => () => ({session: getSessionKey(key)});
