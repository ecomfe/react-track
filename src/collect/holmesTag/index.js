const KEY_TO_TAG_TYPE = {
    PAGE: '_setPageTag',
    VISIT: '_setVisitTag',
    USER: '_setUserTag'
};

const holmesTag = (typeKey, id, valueOrFunc, options) => {
    return (type, location) => {
        if (type !== 'pageView') {
            return null;
        }

        const tagType = KEY_TO_TAG_TYPE[typeKey];

        const value = typeof valueOrFunc === 'function' ? valueOrFunc(location, options) : valueOrFunc;

        if (tagType && value !== null && value !== undefined) {
            return {[`holmesTag${id}`]: [tagType, id, value]};
        }

        return null;
    };
};

export default holmesTag;
