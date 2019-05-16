/**
 * @description 登录友户通
 * @author Kvkens(yueming@yonyou.com)
 * @update 2019-05-13 17:15:22
 * @see https://www.npmjs.com/package/utility
 * @see https://electronjs.org/docs/api/ipc-main
 */

import { ipcMain } from 'electron';

import {
    log, getYhtTicket, getValidateTicketDevelop,
    send, getRemember, getRemoteList, getRemoteZip
} from 'main/util';


export default () => {
    log('加载模块：友户通账号登录体系');
    /**
     * @description 登录
     * @param {object} username password 
     * @returns 
     * 客户端接收：mtl::login::success
     *           mtl::login::fail
     */
    ipcMain.on('mtl::login', async (event, arg) => {
        // console.log(arg);
        // 从友户通取票
        let yht_ticket = await getYhtTicket({ username: arg.username, password: arg.password, remember: arg.remember });
        // 票据是否成功
        if (yht_ticket.success) {
            console.log("login success.");
            // console.log(yht_ticket.ticket);
            // 去开发者中心验票获得登录授权
            let validate_ticket = await getValidateTicketDevelop({ ticket: yht_ticket.ticket });
            // console.log(validate_ticket);
            // let sendResult = await send({
            //     url: 'http://codingcloud5.dev.app.yyuap.com/codingcloud/gentplrepweb/list/mtl'
            // });
            // console.log(sendResult);
            event.sender.send('mtl::login::success', { success: true, message: 'login success.' });
        } else {
            console.log("login fail.");
            event.sender.send('mtl::login::fail', { success: false, message: 'login fail.' });
        }
    });
    // 记住登录返回的用户名和密码
    ipcMain.on('mtl::login::remember', (event, arg) => {
        event.sender.send('mtl::login::remember::success', getRemember());
    });

}