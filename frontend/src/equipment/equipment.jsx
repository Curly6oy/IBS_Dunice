import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import Tabs from '../common/tab/tabs'
import TabsHeader from '../common/tab/tabsHeader'
import TabsContent from '../common/tab/tabsContent'
import TabHeader from '../common/tab/tabHeader'
import TabContent from '../common/tab/tabContent'
import { init, create, update, remove } from './equipmentActions'

import List from './equipmentList'
import Form from './equipmentForm'

class Equipment extends Component {

    componentWillMount() {
        this.props.init()
    }

    render() {
        return (
            <div> 
                <ContentHeader title='Оборудование' small='Управление' />
                <Content> 
                    <Tabs> 
                        <TabsHeader> 
                            <TabHeader label='Список' icon='bars' target='tabList' />
                            <TabHeader label='Создать' icon='plus' target='tabCreate' />
                            <TabHeader label='Обновить' icon='pencil' target='tabUpdate' />
                            <TabHeader label='Удалить' icon='trash-o' target='tabDelete' />
                        </TabsHeader> 
                        <TabsContent> 
                            <TabContent id='tabList'>
                                <List />
                            </TabContent>
                            <TabContent id='tabCreate'>
                                <Form onSubmit={this.props.create}
                                    submitLabel='Создать' submitClass='primary' />
                            </TabContent>
                            <TabContent id='tabUpdate'>
                                <Form onSubmit={this.props.update}
                                    submitLabel='Обновить' submitClass='info' />
                            </TabContent>
                            <TabContent id='tabDelete'>
                                <Form onSubmit={this.props.remove} readOnly={true}
                                    submitLabel='Удалить' submitClass='danger' />
                            </TabContent>
                        </TabsContent> 
                    </Tabs> 
                </Content> 
            </div> 
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    init, create, update, remove
}, dispatch)
export default connect(null, mapDispatchToProps)(Equipment)