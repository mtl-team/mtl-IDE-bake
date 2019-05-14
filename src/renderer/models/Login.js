/**
 * @description 登录
 */

import { actions } from 'mirrorx';

export default {
    name: "login",
    initialState: {
        loading: false,
        username: '',
        password: ''
    },
    reducers: {
        save(state, data) {
            return {
                ...state,
                ...data
            }
        }
    },
    effects: {
        getS(data, getState) {
            return getState();
        }
    }
}
