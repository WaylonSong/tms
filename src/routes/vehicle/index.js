import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm, Tabs } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
const resourceName = "vehicle";
const TabPane = Tabs.TabPane
const EnumCarStatus = {
  ON: 1,
  OFF: 2,
}
const options = ['id', 'number', 'type', 'brand', 'occupy']

const Obj = (props) => {
  var {dispatch, loading, location } = props;
  var obj = props[resourceName];
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys, itemIndexes } = obj
  const { pageSize } = pagination
  const { pathname } = location
  const query = queryString.parse(location.search);
  const getModalTitle = (modalType)=>{
      switch(modalType){
        case 'create':
          return '创建订单'
        case 'update':
          return '编辑订单'
        case 'view':
          return '查看订单'
    }
  };
  const modalProps = {
    item: props[resourceName].modalType === 'create' ? {from:{},to:[{}]} : currentItem,
    itemIndexes,
    visible: props[resourceName].modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[resourceName+'/update'],
    modalType: props[resourceName].modalType,
    title: getModalTitle(props[resourceName].modalType),
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
    }
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
      search: queryString.stringify({...query, status:key, page:1}),
      // query: ({status:key}),
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


  var activeKey = "";
  if(query.status === String(EnumCarStatus.ON))
    activeKey = String(EnumCarStatus.ON)
  else if(query.status === String(EnumCarStatus.OFF))
    activeKey = String(EnumCarStatus.OFF)

  const parsed = queryString.parse(location.search);
  // console.log(location);
  return (
    <Page inner>
      <Filter {...filterProps} />
      {modalVisible && <Modal {...modalProps} />}
      <Tabs activeKey={activeKey} onTabClick={handleTabClick}>
        <TabPane tab="全部" key={""}>
          <List {...listProps} />
        </TabPane>
        <TabPane tab="当班车辆" key={String(EnumCarStatus.ON)}>
          <List {...listProps} />
        </TabPane>
        <TabPane tab="下班车辆" key={String(EnumCarStatus.OFF)}>
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </Page>
  )
}
Obj.propTypes = {
  vehicle: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ vehicle, loading }) => ({ vehicle, loading }))(Obj)
