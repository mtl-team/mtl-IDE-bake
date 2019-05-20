/**
 * @description 设置
 */

import React, { Component } from 'react';
import { Steps, Icon, Row, Col, Select, Form, Input, Switch, Button } from 'antd';
import mirror, { actions, connect } from 'mirrorx';
import { ipcRenderer, remote } from 'electron';
import path from 'path';
import Waiting from './Waiting';
import './Setting.less';

const Step = Steps.Step;
const FormItem = Form.Item;
const Option = Select.Option;
const ipc = ipcRenderer;

let setFieldsValue;
let installTimer, countTimer = 0;
//选择路径后设置路径值
ipc.on('mtl::open::dialog::success', (event, path) => {
    setFieldsValue({
        projectPath: path
    });
});

// MTL zip下载解压完成
ipc.on('mtl::templates::download::success', (event, err) => {
    countTimer = 100;
    clearInterval(installTimer);
    let state = actions.templates.setUpdateProcessState({
        isFinish: true,
        percent: countTimer,
        processMsg: `所有安装已经完毕`,
    });
});


class Setting extends Component {
    //安装
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                //发送IPC执行安装
                ipc.send('mtl::templates::download', { filename: values.title, filepath: `${values.projectPath}/${values.projectName}` });
                //切换组件到等待
                actions.templates.setInitStep(2);

                //启动进度条
                clearInterval(installTimer);
                installTimer = setInterval(() => {
                    countTimer++;
                    if (countTimer > 95) {
                        clearInterval(installTimer);
                    }
                    actions.templates.setUpdateProcessState({
                        isFinish: false,
                        percent: countTimer,
                        processMsg: `正在下载【${values.title}】脚手架请稍等`,
                    });
                }, 1000);

            }
        });
    }
    //选择保存位置dialog
    handlerPath = () => {
        ipc.send('mtl::open::dialog');
    }
    //安装完成
    handlerFinish = () => {
        actions.templates.finish();
    }
    render() {
        let { initStep, setting, title, projectPath, registry, processMsg, percent, isFinish } = this.props;
        const { getFieldDecorator } = this.props.form;
        setFieldsValue = this.props.form.setFieldsValue;
        return (<div className="setting-wrap">
            <Row className="steps-init">
                <Col span={3}></Col>
                <Col span={18}>
                    <Steps current={initStep - 1}>
                        <Step title="设置" icon={<Icon type="setting" />} description="设置项目的配置信息." />
                        <Step title="安装" icon={<Icon type="bars" />} description="处理一些安装信息等." />
                    </Steps>
                </Col>
                <Col span={3}></Col>
            </Row>
            <Row className="init-form">
                <Col span={24}>
                    {initStep == 1 && <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            label="脚手架名称"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                        >
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: '项目名称不能为空' }],
                                initialValue: title
                            })(
                                <Input disabled placeholder='请选择脚手架名称' prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                            )}
                        </FormItem>
                        <FormItem
                            label="项目名称"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                        >
                            {getFieldDecorator('projectName', {
                                rules: [{ required: true, message: '项目名称不能为空' }]
                            })(
                                <Input placeholder='请输入您的项目名' prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                            )}
                        </FormItem>
                        <FormItem
                            label="存储位置"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                        >
                            {getFieldDecorator('projectPath', {
                                rules: [{ required: true, message: '请选择本地开发目录' }],
                                initialValue: projectPath
                            })(
                                <Input disabled placeholder='请选择本地开发目录' addonAfter={<Icon onClick={this.handlerPath} type="folder-open" />} prefix={<Icon type="setting" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                            )}
                        </FormItem>
                    </Form>}
                    {
                        initStep == 2 && <Waiting processMsg={processMsg} percent={percent} />
                    }
                </Col>
            </Row>
            <Row className="opeate">
                {initStep == 1 && <Col span={24}>
                    <div className="setting-btn">
                        <Button icon="left-square-o" onClick={() => { actions.templates.setInitStep(0) }} >返回</Button>
                    </div>
                    <div className="setting-btn">
                        <Button icon="right-square-o" onClick={this.handleSubmit} style={{ "marginRight": "10px" }} type="primary">安装</Button>
                    </div>
                </Col>}
                {
                    initStep == 2 && <Col span={24}>
                        <div className="setting-btn">
                            <Button onClick={this.handlerFinish} loading={!isFinish} icon="right-square-o" style={{ "marginRight": "10px" }} type="primary">{isFinish ? '完成' : '等待'}</Button>
                        </div>
                    </Col>
                }
            </Row>
        </div>
        );
    }
}

export default connect((state) => state.templates)(Form.create()(Setting));