/**
 * 路由表
 */

import React, { Component } from 'react';
import { Switch, Route } from 'mirrorx';
// 登录界面
import Login from 'containers/Login';
// 展示当前模板
import Templates from 'containers/Templates';
// 开发工作区
import WorkSpace from 'containers/WorkSpace';


class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/templates" component={Templates} />
                <Route exact path="/workspace" component={WorkSpace} />
            </Switch>
        );
    }
}

export default Routes;