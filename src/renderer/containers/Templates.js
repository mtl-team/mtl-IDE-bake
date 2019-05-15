/**
 * 模板拉取
 */

import React, { Component } from 'react';
import mirror, { actions, connect } from 'mirrorx';
import { ipcRenderer } from 'electron';

import Templates from '../components/Templates';
import TemplatesModel from '../models/Templates';

const ipc = ipcRenderer;

mirror.model(TemplatesModel);

ipc.on('mtl::templates::get::list::success', (event, data) => {
  actions.templates.save({ list: data.data });
});

mirror.hook((action, getState) => {
  const { routing: { location } } = getState();
  if (action.type === '@@router/LOCATION_CHANGE' && location.pathname === '/templates') {
    ipc.send('mtl::templates::get::list');
  }
});

export default connect((state) => state.templates)(Templates);
