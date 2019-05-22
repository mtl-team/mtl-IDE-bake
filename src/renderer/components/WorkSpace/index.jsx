import React, { Component } from 'react';
import { Row, Col, Layout } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import iosbar from 'static/iosbar.png';

const { Header, Footer, Sider, Content } = Layout;

import './index.less';

class WorkSpace extends Component {
    componentDidMount() {
        const browserView = document.getElementById('browser');
        const devtoolsView = document.getElementById('devtools');
        browserView.addEventListener('dom-ready', () => {
            const browser = browserView.getWebContents();
            // browser.enableDeviceEmulation({ screenPosition: 'mobile' });
            // devtoolsView.getWebContents().enableDeviceEmulation({ screenPosition: 'mobile' });
            browser.setDevToolsWebContents(devtoolsView.getWebContents());
            browser.openDevTools();
        });
        // let webview = document.querySelector("#foo");
        // webview.addEventListener('dom-ready', () => {
        //     // webview.openDevTools({});
        //     })
        // });

        //<webview id="foo" src="https://mobile.ant.design/kitchen-sink/components/drawer?lang=zh-CN#drawer-demo-0" ></webview>
    }
    render() {
        const options = {
            selectOnLineNumbers: true
          };
        return (<div className="workspace-wrap">
            <Layout>
                <Header>Header</Header>
                <Layout>
                    <Sider width={380} className="simulator">
                        <div className="screen">
                            <img src={iosbar} />
                            <webview className="device"
                                id="browser"
                                src="https://mobile.ant.design/kitchen-sink/?lang=zh-CN"
                            >
                            </webview>
                        </div>
                    </Sider>
                    <Content className="opeate">
                        <Layout>
                            <Content className="editor">
                            <Layout>
                                <Layout>
                                    <Sider style={{"background":"#ececec","height":"490px"}}>
                                        Dir
                                    </Sider>
                                    <Content>
                                    <MonacoEditor
                                        width="100%"
                                        height="490px"
                                        language="javascript"
                                        options={options}
                                        value={"console.log(123)"}
                                    />
                                    </Content>
                                </Layout>
                            </Layout>
                            </Content>
                            <Content className="debug">
                                <webview className="chrome-console" id="devtools"></webview>
                            </Content>
                        </Layout>
                    </Content>
                </Layout>
            </Layout>
        </div>);
    }
}

export default WorkSpace;
