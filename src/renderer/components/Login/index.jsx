/**
 * 登录界面
 */

import React, { Component } from 'react';
import mirror, { actions, connect } from 'mirrorx';
import { Layout, Row, Col, Form, Icon, Input, Button, Checkbox, notification } from 'antd';
import { ipcRenderer } from 'electron';
import Helper from '../Helper';

import './index.less';

const ipc = ipcRenderer;
const { Header, Footer, Sider, Content } = Layout;

/**
 * 登录成功
 */
ipc.on('mtl::login::success', (event, msg) => {
    console.log('mtl::login::success', msg);
    notification.success({
        message: '登录成功',
        description: '正在跳转，请稍等！'
    });
    actions.login.save({ loading: false });
    actions.routing.push('/templates');
});
/**
 * 登录失败
 */
ipc.on('mtl::login::fail', (event, msg) => {
    console.log('mtl::login::fail', msg);
    notification.error({
        message: '登录失败',
        description: '友户通权限验证失败，请重试！'
    });
    actions.login.save({ loading: false });
});

/**
 * 记录用户，恢复登录
 */
ipc.on('mtl::login::remember::success', (event, msg) => {
    console.log('mtl::login::remember::success', msg);
    if (msg.success) {
        actions.login.save({
            username: msg.data.username,
            password: msg.data.password
        });
    }
});

class Login extends Component {

    componentDidMount() {
        // 检测是否自动登录
        ipc.send('mtl::login::remember');
    }

    // 登录
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                actions.login.save({ loading: true });
                // 检测前端数据完整性，发送登录消息告知后端服务
                ipc.send('mtl::login', {
                    username: values.username,
                    password: values.password,
                    remember: values.remember
                });
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        let { loading, username, password } = this.props;
        return (
            <Layout className="login-wrap" style={{ "background": "#f4f4f4" }}>
                <Content>
                    <Row>
                        <Col style={{ "background": "#4b4b4b", "height": "608px" }} span={7}>
                            <Helper />
                        </Col>
                        <Col span={17}>
                            <Row>
                                <Col offset={7} span={17}>
                                    <Form onSubmit={this.handleSubmit} className="login-form">
                                        <Form.Item>
                                            {getFieldDecorator('username', {
                                                rules: [{ required: true, message: '请输入友户通账号!' }],
                                                initialValue: username
                                            })(
                                                <Input
                                                    disabled={loading}
                                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                    placeholder="友户通账号"
                                                />,
                                            )}
                                        </Form.Item>
                                        <Form.Item>
                                            {getFieldDecorator('password', {
                                                rules: [{ required: true, message: '请输入友户通密码!' }],
                                                initialValue: password
                                            })(
                                                <Input
                                                    disabled={loading}
                                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                    type="password"
                                                    placeholder="友户通密码"
                                                />,
                                            )}
                                        </Form.Item>
                                        <Form.Item>
                                            {getFieldDecorator('remember', {
                                                valuePropName: 'checked',
                                                initialValue: true,
                                            })(<Checkbox>记住我</Checkbox>)}
                                            <a className="login-form-forgot" href="">
                                                忘记密码?
                                                </a>
                                            <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">
                                                登录
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }
}

export default Form.create({ name: 'normal_login' })(Login);
