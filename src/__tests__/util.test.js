/* eslint-disable import/no-unresolved */
import {isFunction} from 'lodash';
import {createMemoizer} from '../utils';

test('test createMemoizer', () => {
    const selectUser = ({a}, b, c) => ({a, b, c});
    const memoizeSelectUser = createMemoizer(selectUser);
    expect(isFunction(memoizeSelectUser)).toBe(true);

    const data = {a: 1, b: 2, c: 3};
    const seleted1 = memoizeSelectUser(data, 2, 3);
    expect(seleted1).toEqual({a: 1, b: 2, c: 3});

    const seleted2 = memoizeSelectUser(data, 2, 3);
    expect(seleted1 === seleted2).toBe(true);
});
