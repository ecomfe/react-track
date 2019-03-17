import {isFunction} from 'lodash';
import {createMemoizer} from '../src/utils';

test('createMemoizer', () => {
    const selectUser = ({user}, username, age) => ({...user, username, age});
    const memoizeSelectUser = createMemoizer(selectUser);
    expect(isFunction(memoizeSelectUser)).toBe(true);

    const userData = {user: {username: 'user', age: 21}};
    const userSelected = memoizeSelectUser(userData, 'admin');
    expect(userSelected).toEqual({username: 'admin', age: undefined});

    const anotherUserSelected = memoizeSelectUser(userData, 'admin');
    expect(userSelected === anotherUserSelected).toBe(true);

    const memberUserSelected = memoizeSelectUser(userData, 'member');
    expect(userSelected === memberUserSelected).toBe(false);

    const customAdminUserSelected = memoizeSelectUser(userData, 'admin', 18);
    expect(userSelected === customAdminUserSelected).toBe(false);
});
