/**
 * @description 工具类函数
 * @author Kvkens(yueming@yonyou.com)
 * @see https://nodejs.org/dist/latest-v8.x/docs/api/path.html
 * @see https://nodejs.org/dist/latest-v8.x/docs/api/os.html
 * @update 2018-03-29 14:59:48
 */

import { Notification } from 'electron';
const rp = require('request-promise');
import is from 'electron-is';
import fse from 'fs-extra';
import fs from 'fs';
import path from 'path';
const utils = require('utility');
const Configstore = require('configstore');
const conf = new Configstore('mtlconfig');
import { UBA_CONFIG_PATH } from 'main/path';

//不同平台和开发环境
export const isDev = is.dev();
export const isMac = is.macOS();
export const isWin = is.windows();
export const isLinux = is.linux();

/**
 * @description 系统消息推送
 * @param {*} 推送标题 
 * @param {*} 推送子标题
 * @param {*} 推送正文
 */
export const Info = (title = '标题', subtitle = '子标题', body = '正文') => {
    let info = new Notification({
        title,
        subtitle,
        body
    });
    info.show();
}

/**
 * @description npm依赖包安装，基于npm-cli实现
 * @param {event} 上层传入ipc
 * @param {string} 安装依赖路径
 * @param {string} 镜像源
 * @todo 实现本方法
 */
export const npmInstall = ({ event, installPath, registry }) => {

}


/**
 * @description 创建指定的文件夹
 * @param {string} dirPath 欲创建文件夹路径
 * @returns {Promise} promise
 */
export const createDir = async (dirPath) => {
    await fse.mkdir(dirPath);
}

/**
 * @description 写入JSON到文件
 * @param {string} 写入路径、JSON
 * @param {object} 写入JSON对象
 * @returns {Promise} promise
 */
export const writeFileJSON = async (jsonPath, obj) => {
    return await fse.writeJSON(jsonPath, obj);
}

/**
 * @description 读取指定路径下的JSON文件
 * @param {string} 路径 
 * @returns {Promise} promise
 */
export const readFileJSON = async (jsonPath) => {
    return await fse.readJson(jsonPath);
}

/**
 * @description 打印日志
 * @param {string,boolean} 日志内容、可选参数：true=直接显示 false=不显示
 * @returns {string} 日志 时间-内容
 */
export const log = (text, flag) => {
    console.log(`[${getNowDate()}] ${text}`);
    if (flag) {
        console.log(text);
    }
    return `[${getNowDate()}] ${text}`;
}

/**
 * @description 获得主机时间
 * @returns {string} 本机时间
 */
export const getNowDate = () => {
    let dt = new Date();
    return (dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDay() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds());
}


/**
 * @description 检测路径是否存在
 * @param {Array} currArray 要检测的数据对象
 * @param {string} path 要判断的路径
 * @returns {boolean} true=存在 false=不存在
 */
export const isExistPath = (currArray, path) => {
    let flag = false;
    for (let i = 0; i < currArray.length; i++) {
        if (currArray[i].path == path) {
            flag = true;
            break;
        }
    }
    return flag;
}

/**
 * @description 设置最后选择路径
 * @param {*} lastpath 
 */
export const setLastPath = async (lastpath) => {
    let obj = await readFileJSON(UBA_CONFIG_PATH);
    obj.lastPath = lastpath;
    writeFileJSON(UBA_CONFIG_PATH, obj);
}

export const YHT_URL = {
    // 友户通登录开发者中心取票
    YHT_LOGIN_BY_DEVELOP_URL: 'https://euc.yonyoucloud.com/cas/login?sysid=developer&service=https://developer.yonyoucloud.com:443/portal/sso/login.jsp',
    // 开发者中心验票
    DEVELOP_TICKET: 'https://developer.yonyoucloud.com:443/portal/sso/login.jsp',
    // 开发者中心UA
    DEVELOP_HTTP_HEADER_UA: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
    // 开发者中心Referer
    DEVELOP_HTTP_HEADER_REFERER: 'https://developer.yonyoucloud.com'
}

/**
 * 获得友户通单点登录票据
 *
 * @param {*} { username, password } 用户名、密码
 * @returns {JSON} {success,ticket,body}
 */
export const getYhtTicket = async function ({ username, password, remember }) {
    let formData = {
        username: username,
        shaPassword: utils.sha1(password),
        md5Password: utils.md5(password),
        tenantCode: 'default',
        tenantid: -1,
        lt: '',
        execution: '',
        _eventId: 'submit',
        tokeninfo: null,
        isAutoLogin: 0,
        randomvalue: 1557123285843,
        validateCode: '',
        validateKey: 1557123285000
    }
    // 构建登录友户通目的为了获得ticket
    let options = {
        url: YHT_URL.YHT_LOGIN_BY_DEVELOP_URL,
        headers: {
            'User-Agent': YHT_URL.DEVELOP_HTTP_HEADER_UA
        },
        jar: true,
        method: 'post',
        form: formData
    };


    let resultJSON = {};
    let yht_ticket_data = await rp(options);
    // console.log(yht_ticket_data)
    let result = yht_ticket_data.indexOf('?ticket=');
    if (result !== -1) {
        console.log('友户通取票成功');
        // 写配置
        conf.set('username', username);
        remember ? conf.set('password', password) : conf.delete('password');
        conf.set('shaPassword', utils.sha1(password));
        conf.set('md5Password', utils.md5(password));
        // 取票
        let ticket = yht_ticket_data.split('?ticket=')[1].split('";')[0];
        resultJSON['success'] = true;
        // 写票
        resultJSON['ticket'] = ticket;
        conf.set('ticket', ticket);
        // 返回原始body
        resultJSON['body'] = yht_ticket_data;
    } else {
        resultJSON['success'] = false;
    }
    return resultJSON;
}

/**
 * 开发者中心验票
 *
 * @param {*} { ticket } 票据
 * @returns {JSON} {success,body}
 */
export const getValidateTicketDevelop = async function ({ ticket }) {
    let options = {
        url: YHT_URL.DEVELOP_TICKET,
        qs: {
            ticket
        },
        jar: true,
        method: 'get',
        headers: {
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': YHT_URL.DEVELOP_HTTP_HEADER_UA,
            'Referer': YHT_URL.DEVELOP_HTTP_HEADER_REFERER
        },
    }
    let resultJSON = {};
    let yht_validate_ticket_data = await rp(options);
    let result = yht_validate_ticket_data.indexOf('/fe/fe-portal/index.html');
    if (result !== -1) {
        console.log('开发者中心验票授权成功');
        resultJSON['success'] = true;
        resultJSON['body'] = yht_validate_ticket_data;
    } else {
        resultJSON['success'] = false;
    }
    // 读取完整的Cookies
    rp(options, function (err, res, body) {
        if (body.indexOf('/fe/fe-portal/index.html') !== -1) {
            let devcookie = res.request.req.getHeader('cookie');
            conf.set('cookie', devcookie);
            // console.log(devcookie);
        }

    });
    return resultJSON;
}
/**
 * 请求数据
 *
 * @param {*} { options } 票据
 * @returns {JSON} {success,body}
 */
export const send = async function (options) {
    let opts = {
        jar: true,
        method: 'get',
        headers: {
            'cookie': conf.get('cookie'),
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': YHT_URL.DEVELOP_HTTP_HEADER_UA,
            'Referer': YHT_URL.DEVELOP_HTTP_HEADER_REFERER
        }
    }
    opts = { ...opts, ...options };
    let result = await rp(opts);
    // console.log(result)
    return result;
}
/**
 * 下载资源
 *
 * @param {*} { options } 参数
 * @returns {JSON} {success,body}
 */
export const download = function (options, filename, cb) {
    let opts = {
        method: 'get',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': conf.get('cookie'),
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': YHT_URL.DEVELOP_HTTP_HEADER_UA,
            'Referer': YHT_URL.DEVELOP_HTTP_HEADER_REFERER
        }
    }
    opts = { ...opts, ...options };
    // 获得文件夹路径
    let fileFolder = path.dirname(filename);
    // 创建文件夹
    fse.ensureDirSync(fileFolder);
    // 开始下载无需返回
    rp(opts).pipe(fse.createWriteStream(filename)).on('close', cb);
}
/**
 * 是否保存用户和密码并返回
 *
 * @param {*} { options } 参数
 * @returns {JSON} {success,body}
 */
export const getRemember = () => {
    let username = conf.get('username');
    let password = conf.get('password');
    let resultJson = {}
    if (username && password) {
        resultJson = {
            success: true,
            data: {
                username,
                password
            }
        }
    } else {
        resultJson = {
            success: false
        }
    }
    return resultJson;
}

/**
 * 获得远端的模板列表JSON
 */
export const getRemoteList = async () => {
    let opt = {
        url: 'http://cloudcoding.dev.app.yyuap.com/codingcloud/gentplrepweb/list/mtl'
    };
    return await send(opt);
}

/**
 * 下载zip压缩包包含路径文件名
 */
export const getRemoteZip = ({ filename, filepath }, cb) => {
    let url = `http://codingcloud5.dev.app.yyuap.com/codingcloud/genweb/downloadIuapFe?projectCode=${filename}`
    return new Promise((resolve, reject) => {
        download({ url }, `${filepath}/${filename}.zip`, () => {
            resolve({ success: true });
        });
    });
    // download({ url }, `${filepath}/${filename}.zip`, cb);
}
