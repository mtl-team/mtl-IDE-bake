import React, { Component } from 'react';
import { actions } from 'mirrorx';
import { Row, Col, Layout, Tabs, Button } from 'antd';
import { ipcRenderer } from 'electron';
import MonacoEditor from 'react-monaco-editor';
import iosbar from 'static/iostopbar.png';

const { Header, Footer, Sider, Content } = Layout;
const TabPane = Tabs.TabPane;
const ipc = ipcRenderer;
import './index.less';

ipc.on('mtl::workspace::dir::success', (event, fpath) => {
    console.log(fpath)
});

class WorkSpace extends Component {
    componentDidMount() {
        const browserView = document.getElementById('browser');
        const devtoolsView = document.getElementById('devtools');
        browserView.addEventListener('dom-ready', () => {
            const browser = browserView.getWebContents();
            browser.setDevToolsWebContents(devtoolsView.getWebContents());
            browser.openDevTools();
        });
        ipc.send('mtl::workspace::dir', { path: '/Users/kvkens/code/test/1/mtl/' });
        //<webview id="foo" src="https://mobile.ant.design/kitchen-sink/?lang=zh-CN" ></webview>
    }
    handlerAdd = () => {


        let n = this.props.editor.slice();
        let t = {
            title: `app${n.length + 1}.js`,
            code: `console.log(${n.length + 1});`,
            language: 'javascript',
            key: `${n.length + 1}` + ""
        };
        n.push(t);
        actions.workspace.save({
            editor: n
        });

    }
    handlerTab = (targetKey, action) => {
        console.log(targetKey, action);
        let editor = this.props.editor.slice();
        if (action == 'remove') {
            editor.map((item, i) => {
                if (item.key == targetKey) {
                    editor.splice(i, 1);
                }
            });
        }
        actions.workspace.save({ editor });
    }
    render() {
        const options = {
            selectOnLineNumbers: true
        };
        let { editor } = this.props;
        return (<div className="workspace-wrap">
            <Layout>
                <Header>Header</Header>
                <Layout>
                    <Sider width={380} className="simulator">
                        <div className="screen">
                            <img src={iosbar} />
                            <webview className="device"
                                id="browser"
                                src="http://tinper.org/"
                            >
                            </webview>
                        </div>
                    </Sider>
                    <Content className="work-bench">
                        <Layout>
                            <Content className="editor">
                                <Layout>
                                    <Layout>
                                        <Sider width="200px" className="folder-project" style={{ "background": "", "height": "490px" }}>
                                            <Button onClick={this.handlerAdd}>
                                                增加
                                            </Button>
                                        </Sider>
                                        <Content className="edit-content">
                                            <Tabs
                                                type="editable-card"
                                                hideAdd
                                                onEdit={this.handlerTab}
                                            >
                                                {editor.map(_editor => {
                                                    return <TabPane forceRender={true} tab={_editor.title} key={_editor.key} closable={true}>
                                                        <MonacoEditor
                                                            width="100%"
                                                            height="434px"
                                                            language={_editor.language}
                                                            options={options}
                                                            value={_editor.code}
                                                        />
                                                    </TabPane>
                                                })}
                                            </Tabs>
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
