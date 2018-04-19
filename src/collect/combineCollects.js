export default (...collects) => (...args) => collects.reduce(
    (result, collect) => {
        const data = collect(...args);
        return {...result, ...data};
    },
    {}
);
