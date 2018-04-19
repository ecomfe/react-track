import platform from 'platform';

export default () => {
    const ua = platform.parse(navigator.userAgent);

    return type => {
        if (type !== 'pageView') {
            return null;
        }

        return {
            userAgent: ua,
            resolution: {
                width: screen.width,
                height: screen.height
            },
            os: {
                family: ua.os.family,
                version: ua.os.version
            },
            browser: {
                name: ua.name,
                version: ua.version.match(/\d+/)[0]
            },
            language: navigator.language
        };
    };
};
