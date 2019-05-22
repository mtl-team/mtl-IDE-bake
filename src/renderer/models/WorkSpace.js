/**
 * 模板拉取
 */

import { actions } from 'mirrorx';

import { ipcRenderer, remote } from 'electron';

export default {
    name: "workspace",
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
