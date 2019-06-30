import {CollectGenerator} from '../types';

export default (...collects: CollectGenerator<unknown>[]) => (...args) => collects.reduce(
    (result, collect) => {
        const data = collect(...args);
        return {...result, ...data};
    },
    {}
);
