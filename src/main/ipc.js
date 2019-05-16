/**
 * @description IPC消息类
 * @author Kvkens(yueming@yonyou.com)
 * @update 2018-03-22 14:14:29
 * @see https://electronjs.org/docs/api/ipc-main
 * @see https://electronjs.org/docs/api/shell
 * @see https://electronjs.org/docs/api/dialog
 * @see https://electronjs.org/docs/api/notification
 */

import login from './ipc/login';
import templates from './ipc/templates';

const IPC = () => {
    login();// 登录友户通
    templates();// 在线模板
}

export default IPC;