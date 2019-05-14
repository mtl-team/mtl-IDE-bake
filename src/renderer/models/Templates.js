/**
 * 模板拉取
 */

import { actions } from 'mirrorx';

export default {
    name: "templates",
    initialState: {

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
