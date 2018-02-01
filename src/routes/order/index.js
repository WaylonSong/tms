import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm, Tabs } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import CreateModal from './CreateModal'
import ViewModal from './ViewModal'
import ACInput from '../../components/Map/ACInput'
import {OrderDetailStateDict, EnumDeliveryStatusDict} from '../../utils/dict'
import {OrderDetailState, EnumDeliveryStatus} from '../../utils/enums'

const resourceName = "order";
const TabPane = Tabs.TabPane
const EnumPostStatus = {
  UNPUBLISH: 1,
  PUBLISHED: 2,
}
const options = ['id', 'from.name', 'from.address', 'from.phone', 'to.name', 'to.address', 'to.phone']

const Obj = (props) => {
  var {dispatch, loading, location } = props;
  var obj = props[resourceName];
  const { list, pagination, currentItem, modalVisible, viewModalVisible, modalType, isMotion, selectedRowKeys, itemIndexes } = obj
  const { pageSize } = pagination
  const { pathname } = location
  const query = queryString.parse(location.search);
  const getModalTitle = (modalType, id='')=>{
      switch(modalType){
        case 'create':
          return '创建订单'
        case 'update':
          return '编辑订单: '+id
        case 'view':
          return '查看订单：'+id
    }
  };
  const modalProps = {
    item: props[resourceName].modalType === 'create' ? {from:{},to:[{}]} : currentItem,
    itemIndexes,
    visible: props[resourceName].modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[resourceName+'/update'],
    modalType: props[resourceName].modalType,
    title: getModalTitle(props[resourceName].modalType, currentItem.id),
    wrapresourceName: 'vertical-center-modal',
    onOk (data) {
      if(modalType == "view"){
        dispatch({
          type: resourceName+'/hideModal',
        })
      }
      else{
        dispatch({
          type: `${resourceName}/${modalType}`,
          payload: data,
        })
      }
    },
    onCancel () {
      dispatch({
        type: resourceName+'/hideModal',
      })
    },
    onAddBlankTo : ()=>{
      dispatch({
        type : 'order/addBlanckTo',
      })
    },
    onMinusTo : (counter) =>{
      dispatch({
        type : 'order/minusTo',
        payload: counter
      })
    }, 
    onDirect : (diveryId)=>()=>{
      dispatch(routerRedux.push({
        pathname: `/delivery/${diveryId}`
      }))
    }
  }

  const viewModalProps = {
    item: currentItem,
    visible: props[resourceName].viewModalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[resourceName+'/update'],
    modalType: props[resourceName].modalType,
    title: "订单详情："+currentItem.id,
    wrapresourceName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: resourceName+'/hideViewModal',
      })
    },
  }
  const listProps = {
    resourceName,
    dataSource: list,
    loading: loading.effects['order/query'],
    pagination,
    location,
    isMotion,
    onChange (page) {
      dispatch(routerRedux.push({
        pathname,
        search: queryString.stringify({
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        }),
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: `${resourceName}/delete`,
        payload: id,
      })
    },
    onEditItem (recordId, type) {
      dispatch({
        type: `${resourceName}/editItem`,
        payload: {
          modalType: type,
          currentItemId: recordId,
        },
      })
    },
  }
  const handleTabClick = (key) => {
    var routes = {
      pathname,
      search: queryString.stringify({...query, state:key, page:1}),
    }
    dispatch(routerRedux.push(routes))
  }
  const filterProps = {
    addOrder () {
      dispatch({
        type: resourceName+'/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onFilterChange (fields) {

      var params = {...query}
      for(var i in options){
        delete params[options[i]]
      }
      if(typeof(fields['field'])!='undefined')
        params[fields['field']] = fields['value']
      delete fields['field']
      delete fields['value']
      params = {...params, page:1, ...fields, pageSize }
      console.log(fields, params)
      dispatch(routerRedux.push({
        search: queryString.stringify(params)
      }))
    },
  }
  const handleToAddress = ()=>{
    console.log("handle")
  }
  var activeKey = "";
  if(query.state){
    activeKey = String(query.state)
  }
  const parsed = queryString.parse(location.search);
  return (
    <Page inner>
      <Filter {...filterProps} />
      {modalVisible && <CreateModal {...modalProps} />}
      {viewModalVisible && <ViewModal {...viewModalProps} />}
      <Tabs activeKey={activeKey} onTabClick={handleTabClick} size="small">
        <TabPane tab="全部" key={""}>
          <List {...listProps} />
        </TabPane>
        {OrderDetailStateDict.map((i, index)=>{
          return (
            <TabPane tab={i} key={String(index)}>
              <List {...listProps} />
            </TabPane>)
        })}
      </Tabs>
    </Page>
  )
}
Obj.propTypes = {
  order: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ order, loading }) => ({ order, loading }))(Obj)
