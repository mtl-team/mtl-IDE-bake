/**
 * 获得远端模板信息
 */

import React, { Component } from 'react';
import mirror, { actions, connect } from 'mirrorx';
import { Layout, Row, Col, Form, Icon, Input, Button, Checkbox, notification } from 'antd';
import { ipcRenderer } from 'electron';
import Helper from '../Helper';
import CreateProject from './CreateProject';
import Setting from './Setting';

import './index.less';

const ipc = ipcRenderer;
const { Header, Footer, Sider, Content } = Layout;

class Templates extends Component {

    componentDidMount() {
    }
    render() {
        let { initStep } = this.props;
        return (
            <Layout className="login-wrap" style={{ "background": "#f4f4f4" }}>
                <Content>
                    <Row>
                        <Col style={{ "background": "#4b4b4b", "height": "608px" }} span={7}>
                            <Helper />
                        </Col>
                        <Col span={17}>
                            {initStep == 0 && <CreateProject />}
                            {(initStep == 1 || initStep == 2) && <Setting />}
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }
}

export default Templates
