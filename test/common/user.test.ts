import { User } from '../../common/user';
import * as assert from 'assert';

describe('User', () => {
    describe('constructor', () => {
        it('should be successful', () => {
            let user = new User();
            assert.deepEqual(user, { Id: 1, Name: 'bob' })
        });
    });
});