/**
 * 路由表
 */

import React, { Component } from 'react';
import { Switch, Route } from 'mirrorx';
// 登录界面
import Login from 'containers/Login';
// 展示当前模板
import Templates from 'containers/Templates';


class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/templates" component={Templates} />
            </Switch>
        );
    }
}

export default Routes;