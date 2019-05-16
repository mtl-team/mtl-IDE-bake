/**
 * @description 在线模板
 * @author Kvkens(yueming@yonyou.com)
 * @update 2019-05-16 18:33:02
 * @see https://electronjs.org/docs/api/ipc-main
 */

import { ipcMain } from 'electron';

import {
    log, getYhtTicket, getValidateTicketDevelop,
    send, getRemember, getRemoteList, getRemoteZip
} from 'main/util';


export default () => {
    log('加载模块：MTL模板在线');
    // 获得在线列表
    ipcMain.on('mtl::templates::get::list', async (event, arg) => {
        let result = JSON.parse(await getRemoteList());
        let jsondata = {
            success: result.success == 'success',
            data: result.success == 'success' ? result.detailMsg.data.content : []
        }
        if (result.success == 'success') {
            event.sender.send('mtl::templates::get::list::success', jsondata);
        } else {
            event.sender.send('mtl::templates::get::list::fail', jsondata);
        }
    });
    // 下载文件
    ipcMain.on('mtl::templates::download', async (event, arg) => {
        await getRemoteZip(arg.filename);
    });
}