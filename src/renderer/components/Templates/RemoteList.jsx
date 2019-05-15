/**
 * 列表展示
 */

import React, { Component } from 'react';
import mirror, { actions, connect } from 'mirrorx';
import { Card, Tooltip } from 'antd';
import './RemoteList.less';

class RemoteList extends Component {
    cardHandler = (item) => () => {
        actions.templates.setSelectProject(item);
    }
    renderProject = (list) => {
        return <Card title={'MTL在线工程模板'}>
            {
                list.map((subItem, subIndex) => (<Tooltip key={subIndex} title={`${subItem.tplRepName} - ${subItem.genProName}`}>
                    <Card.Grid onClick={this.cardHandler(subItem)} key={subIndex} className="card-item">
                        <img className="thumbnail" src={'https://img.alicdn.com/tfs/TB1tnAWdHSYBuNjSspiXXXNzpXa-1920-1080.png'} />
                        <p className="subtitle">{subItem.tplRepName}</p>
                    </Card.Grid>
                </Tooltip>))
            }
        </Card>
    }
    render() {
        let { list } = this.props;
        return (
            <div className="fengchao-wrap">
                {
                    list.length === 0 && <Card loading></Card>
                }
                {
                    list.length !== 0 && this.renderProject(list)
                }
            </div>
        );
    }
}

export default connect((state) => state.templates)(RemoteList);