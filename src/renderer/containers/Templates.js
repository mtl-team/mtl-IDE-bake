/**
 * 模板拉取
 */

import React, { Component } from 'react';
import mirror, { actions, connect } from 'mirrorx';
import Templates from '../components/Templates';
import TemplatesModel from '../models/Templates';


mirror.model(TemplatesModel);

mirror.hook((action, getState) => {
  const { routing: { location } } = getState();
  if (action.type === '@@router/LOCATION_CHANGE' && location.pathname === '/templates') {

  }
});

export default connect((state) => state.templates)(Templates);
