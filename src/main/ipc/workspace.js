/**
 * @description 登录友户通
 * @author Kvkens(yueming@yonyou.com)
 * @update 2019-05-23 15:58:07
 * @see https://electronjs.org/docs/api/ipc-main
 */

import { ipcMain } from 'electron';

import {
    log, fileDisplay
} from 'main/util';


export default () => {
    log('加载模块：工作区模块');
    /**
     * @description 读取文件夹递归目录
     * @returns 
     */
    ipcMain.on('mtl::workspace::dir', (event, arg) => {
        event.sender.send('mtl::workspace::dir::success', fileDisplay(arg.path));
    });

}