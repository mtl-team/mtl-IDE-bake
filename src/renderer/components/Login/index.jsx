/**
 * @description 登录
 */

import React, { Component } from 'react';
import mirror, { actions, connect } from 'mirrorx';
import { Layout, Row, Col, Form, Icon, Input, Button, Checkbox, notification } from 'antd';
import { ipcRenderer } from 'electron';
import Helper from '../Welcome/Helper';

import './index.less';

const ipc = ipcRenderer;
const { Header, Footer, Sider, Content } = Layout;

/**
 * 接收服务端当前运行npm镜像检测
 */
// ipc.on('uba::checkNpm::success', (event, msg) => {
//     if (msg) {
//         actions.welcome.changeYonyouNpm();
//     }
// });

// ipc.send('uba::set::config',{
//     runProject : path.join(item.projectPath,item.projectName),
//     title:item.title
// });
/**
 * 登录成功
 */
ipc.on('mtl::login::success', (event, msg) => {
    console.log('mtl::login::success', msg);
    notification.error({
        message: '登录成功',
        description: '正在跳转，请稍等！'
    });
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

class Login extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                // actions.login.save({ loading: true });

                ipc.send('mtl::login', {
                    username: values.username,
                    password: values.password
                });
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        let { loading } = this.props;
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
