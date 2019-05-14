/**
 * 登录
 */

import React, { Component } from 'react';
import mirror, { actions, connect } from 'mirrorx';
import Login from '../components/Login';
import LoginModel from '../models/Login';


mirror.model(LoginModel);

mirror.hook((action, getState) => {
  const { routing: { location } } = getState();
  if (action.type === '@@router/LOCATION_CHANGE' && location.pathname === '/') {

  }
});

export default connect((state) => state.login)(Login);
