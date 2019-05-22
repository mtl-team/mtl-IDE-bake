import React, { Component } from 'react';
import { Row, Col, Layout } from 'antd';
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
        return (<div className="workspace-wrap">
            <Layout>
                <Header>Header</Header>
                <Layout>
                    <Sider width={380} className="simulator">
                        <div className="screen">
                            <img src={iosbar} />
                            <webview style={{ "width": "100%", "height": "650px" }}
                                id="browser"
                                src="https://mobile.ant.design/kitchen-sink/?lang=zh-CN"
                            >
                            </webview>
                        </div>
                    </Sider>
                    <Content>
                        <webview style={{ "height": "100%" }} id="devtools"></webview>
                    </Content>
                </Layout>
            </Layout>
        </div>);
    }
}

export default WorkSpace;
