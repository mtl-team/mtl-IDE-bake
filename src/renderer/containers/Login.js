/**
 * 登录
 */

import React, { Component } from 'react';
import mirror, { actions, connect } from 'mirrorx';
import Login from '../components/Login';
import LoginModel from '../models/Login';
import { ipcRenderer } from 'electron';

const ipc = ipcRenderer;

mirror.model(LoginModel);

mirror.hook((action, getState) => {
  const { routing: { location } } = getState();
  if (action.type === '@@router/LOCATION_CHANGE' && location.pathname === '/') {
    //检测是否在公司内网环境，通过npm私有服务判断
    // ipc.send('uba::checkNpm', {
    //   ip: '172.16.75.107',
    //   port: '8081'
    // });
    //检测本地配置文件
    // ipc.send('uba::checkLocalUbaConfig');
    //加载远程模板
    // actions.welcome.getRemoteConfigTemplates();
  }
});

export default connect((state) => state.login)(Login);
