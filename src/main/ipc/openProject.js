/**
 * @description 打开本地文件夹
 * @author Kvkens(yueming@yonyou.com)
 * @update 2019-05-16 19:08:11
 * @see https://electronjs.org/docs/api/dialog
 * @see https://electronjs.org/docs/api/ipc-main
 */

import { ipcMain, dialog } from 'electron';
import { log } from 'main/util';


export default () => {
    log('加载模块：选择最佳实践的对话框');
    /**
     * @description mtl::
     * @returns {string} path 选择的路径
     */
    ipcMain.on('mtl::open::dialog', (event) => {
        let path = dialog.showOpenDialog({ properties: ['openDirectory'] });
        console.log(path);
        if (path && path.length !== 0) {
            event.sender.send('mtl::open::dialog::success', path[0]);
        }
    });
}