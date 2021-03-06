/**
 * @description 在线模板
 * @author Kvkens(yueming@yonyou.com)
 * @update 2019-05-16 18:33:02
 * @see https://electronjs.org/docs/api/ipc-main
 */

import { ipcMain } from 'electron';

import {
    log, getYhtTicket, getValidateTicketDevelop,
    send, getRemember, getRemoteList,
    getRemoteZip, setProjectConfig, getProjectConfig
} from 'main/util';
import fse from 'fs-extra';
import unzipper from 'unzipper';


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
        let result = await getRemoteZip(arg);
        if (result.success) {
            fse.createReadStream(`${arg.filepath}/${arg.filename}.zip`).pipe(unzipper.Extract({ path: arg.filepath })).on('close', () => {
                // 解压完成发送消息
                event.sender.send('mtl::templates::download::success');
                // 删除压缩包
                fse.remove(`${arg.filepath}/${arg.filename}.zip`);
                // 写入配置项目路径
                setProjectConfig(`${arg.filepath}/${arg.filename}`);
            });
        }
    });
    // 显示历史
    ipcMain.on('mtl::templates::projectpath', async (event, arg) => {
        event.sender.send('mtl::templates::projectpath::success', getProjectConfig());
    });
}