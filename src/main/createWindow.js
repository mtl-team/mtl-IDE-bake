/**
 * @description 窗口实例类
 * @author Kvkens(yueming@yonyou.com)
 * @see https://electronjs.org/docs/api/browser-window
 * @update 2018-03-22 11:29:58
 */

import { BrowserWindow, app } from 'electron';
import { format } from 'url';
import { resolve } from 'path';
import { clearScreenDown } from 'readline';

const createWindow = () => {
    // Create the browser window.
    let win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
            devTools: true
        },
        width: 930,
        minWidth: 930,
        maxWidth: 1300,
        height: 630,
        minHeight: 630,
        maxHeight: 825,
        center: true,
        resizable: true,
        alwaysOnTop: false,
        frame: true,
        // titleBarStyle: 'hidden',
        skipTaskbar: false
    });
    if (__isDev__) {
        win.loadURL('http://localhost:9000/index.html');
        BrowserWindow.addDevToolsExtension('/Users/kvkens/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0');
        BrowserWindow.addDevToolsExtension('/Users/kvkens/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0');
        // Open the DevTools.
        win.webContents.openDevTools();
    } else {
        win.loadURL(format({
            pathname: resolve(process.resourcesPath, 'app/renderer/index.html'),
            protocol: 'file:',
            slashes: true,
        }));
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        win = null;
    });
    global.win = win;
    return win;
}

export default createWindow;