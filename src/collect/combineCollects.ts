import {CollectGenerator} from '../types';

function combineCollect<T1, T2>(collect1: CollectGenerator<T1>, collect2: CollectGenerator<T2>): (...args) => T1 & T2;

function combineCollect<T1, T2, T3>(
    collect1: CollectGenerator<T1>,
    collect2: CollectGenerator<T2>,
    collect3: CollectGenerator<T3>
): (...args) => T1 & T2 & T3;

function combineCollect<T1, T2, T3, T4>(
    collect1: CollectGenerator<T1>,
    collect2: CollectGenerator<T2>,
    collect3: CollectGenerator<T3>,
    collect4: CollectGenerator<T4>
): (...args) => T1 & T2 & T3 & T4;

function combineCollect<T1, T2, T3, T4, T5>(
    collect1: CollectGenerator<T1>,
    collect2: CollectGenerator<T2>,
    collect3: CollectGenerator<T3>,
    collect4: CollectGenerator<T4>,
    collect5: CollectGenerator<T5>
): (...args) => T1 & T2 & T3 & T4 & T5;

function combineCollect<T1, T2, T3, T4, T5, T6>(
    collect1: CollectGenerator<T1>,
    collect2: CollectGenerator<T2>,
    collect3: CollectGenerator<T3>,
    collect4: CollectGenerator<T4>,
    collect5: CollectGenerator<T5>,
    collect6: CollectGenerator<T6>
): (...args) => T1 & T2 & T3 & T4 & T6;

function combineCollect(...collects: Array<CollectGenerator<unknown>>) {
    return (...args: any[]) =>
        collects.reduce(
            (result, collect) => {
                const data = collect(...args);
                return {...result, ...data};
            },
            {}
        );
}

export default combineCollect;
