/**
 * Setting容器
 */

import React, { Component } from 'react';
import mirror, { actions, connect } from 'mirrorx';
import path from 'path';
import { readFileSync } from 'fs-extra';
import WorkSpace from '../components/WorkSpace';
import WorkSpaceModel from '../models/WorkSpace';
import { ipcRenderer } from 'electron';

const ipc = ipcRenderer;

mirror.model(WorkSpaceModel);

mirror.hook((action, getState) => {
  const { routing: { location } } = getState();
  if (action.type === '@@router/LOCATION_CHANGE' && location.pathname === '/workspace') {
    
  }
});



export default connect((state) => state.workspace)(WorkSpace);
