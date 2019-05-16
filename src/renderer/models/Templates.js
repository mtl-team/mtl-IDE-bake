/**
 * 模板拉取
 */

import { actions } from 'mirrorx';

import { ipcRenderer, remote } from 'electron';
import * as api from 'services/Templates';

export default {
    name: "templates",
    initialState: {
        list: [],//最佳实践远端数据
        historyProject: [],//本地打开后的历史记录
        title: "请从上面列表中选择",//脚手架中文名字
        organization: "",//下载代码组织名字
        repositories: "",//下载代码仓库名字
        preview: "",//脚手架预览图
        projectName: "",//项目名称
        projectPath: "",//项目文件夹路径
        npmInstall: true,//是否自动安装npm包
        registry: "https://registry.npm.taobao.org",//默认的镜像源选择
        initStep: 0, //初始化设置步骤 0=选择工程、1=设置项目、2=安装依赖包
        scaffold: {},//选择脚手架全部对象信息
        processMsg: "",//进度信息
        percent: 0,//百分比
        isFinish: false,//是否完成安装
    },
    reducers: {
        save(state, data) {
            return {
                ...state,
                ...data
            }
        }
    },
    effects: {
        getS(data, getState) {
            return getState();
        },
        async getRemoteConfigTemplates(data, getState) {
            let { data: list } = await api.getProjectTemplates();
            actions.templates.save({ list: list.project });
        },
        //设置选择脚手架信息
        setSelectProject(data, getState) {
            actions.templates.save({
                title: data.tplRepName,
                organization: data.tplRepName,
                repositories: data.tplRepName,
                preview: data.preview,
                processMsg: `正在下载【${data.tplRepName}】脚手架工程中`
            });
        },
        //设置历史记录数据
        setHistoryProject(data, getState) {
            actions.templates.save({ historyProject: data });
        },
        //设置最后保存的路径
        setLastPath(data, getState) {
            actions.templates.save({ projectPath: data });
        },
        //设置steps位置
        setInitStep(data, getState) {
            actions.templates.save({ initStep: data });
        },
        //设置npm镜像源
        setRegistry(data, getState) {
            //actions.templates.save({ setting: { registry: data } });
        },
        //安装设置
        setSetting(data, getState) {
            actions.templates.save({
                projectName: data.title,
                projectPath: `${data.projectPath}/${data.projectName}`,
                // npmInstall: data.npmInstall,
                // registry: data.registry
            });
        },
        //修改内网npm镜像源
        // changeYonyouNpm(data, getState) {
        //     actions.templates.save({
        //         registry: 'http://172.16.75.107:8081/repository/ynpm-group/'
        //     });
        // },
        //获得安装的参数
        getInitParams(data, getState) {
            let { title, organization, repositories, projectName, projectPath, npmInstall, registry } = getState().templates;
            let {runProject} = getState().main;
            return {runProject, title, organization, repositories, projectName, projectPath, npmInstall, registry };
        },
        //更新安装进度条
        setUpdateProcessState(data, getState) {
            let { isFinish, percent, processMsg } = data;
            actions.templates.save({
                isFinish,
                percent,
                processMsg
            });
            return getState().templates;
        },
        //安装完成后的
        finish(data, getState) {
            actions.templates.setInitStep(0);
            let win = remote.getGlobal('win');
            win.setSize(1380, 825, true);
            win.center();
            actions.routing.push('main/welcome');
        }
    }
}
