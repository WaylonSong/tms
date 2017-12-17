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
const resourceName = "delivery";
const TabPane = Tabs.TabPane
const EnumPostStatus = {
  NOT_DISTRIBUTED : 1,
  NOT_RECEIVED : 2,
  ONBOARD : 3,
  RECEIVED : 4,
}
const options = ['id', 'from_name', 'from_phone', 'to_name']

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
        type : 'delivery/addBlanckTo',
      })
    },
    onMinusTo : (counter) =>{
      dispatch({
        type : 'delivery/minusTo',
        payload: counter
      })
    }
  }

  const listProps = {
    resourceName,
    dataSource: list,
    loading: loading.effects['delivery/query'],
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
    // rowSelection: {
      // selectedRowKeys,
      // onChange: (keys) => {
      //   dispatch({
      //     type: 'user/updateState',
      //     payload: {
      //       selectedRowKeys: keys,
      //     },
      //   })
      // },
    // },
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
  let activeKey = "";
  if(query.status)
    activeKey = query.status;

  const parsed = queryString.parse(location.search);
  // console.log(location);
  return (
    <Page inner>
      <Filter {...filterProps} />
      {modalVisible && <Modal {...modalProps} />}
      <Tabs type="line" size='small' activeKey={activeKey} onTabClick={handleTabClick}>
        <TabPane tab="全部" key={""}>
          <List {...listProps} />
        </TabPane>
        <TabPane tab="待分配" key={String(EnumPostStatus.NOT_DISTRIBUTED)}>
          <List {...listProps} />
        </TabPane>
        <TabPane tab="待接货" key={String(EnumPostStatus.NOT_RECEIVED)}>
          <List {...listProps} />
        </TabPane>
        <TabPane tab="配送中" key={String(EnumPostStatus.ONBOARD)}>
          <List {...listProps} />
        </TabPane>
        <TabPane tab="已送达" key={String(EnumPostStatus.RECEIVED)}>
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </Page>
  )
}
Obj.propTypes = {
  delivery: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ delivery, loading }) => ({ delivery, loading }))(Obj)
