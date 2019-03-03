import platform from 'platform';

export default () => {
    const {ua, name, version, os} = platform.parse(navigator.userAgent);

    return type => {
        if (type !== 'pageView') {
            return null;
        }

        return {
            userAgent: ua,
            resolution: {
                width: screen.width,
                height: screen.height,
            },
            os: {
                family: os.family,
                version: os.version,
            },
            browser: {
                name: name,
                version: version,
            },
            language: navigator.language,
        };
    };
};
