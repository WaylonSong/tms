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
const resourceName = "order";
const TabPane = Tabs.TabPane
const EnumPostStatus = {
  UNPUBLISH: 1,
  PUBLISHED: 2,
}

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
          // currentItem: {from:{phone:"123456"}, to:[{phone:"123"}, {phone:"456"}]},
        },
      })
    },
    rowSelection: {
      // selectedRowKeys,
      // onChange: (keys) => {
      //   dispatch({
      //     type: 'user/updateState',
      //     payload: {
      //       selectedRowKeys: keys,
      //     },
      //   })
      // },
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
      var params = {...query, ...fields, page:1, pageSize}
      dispatch(routerRedux.push({
        search: queryString.stringify(params)
      }))
    },
  }


  var activeKey = "";
  if(query.status === String(EnumPostStatus.UNPUBLISH))
    activeKey = String(EnumPostStatus.UNPUBLISH)
  else if(query.status === String(EnumPostStatus.PUBLISHED))
    activeKey = String(EnumPostStatus.PUBLISHED)

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
        <TabPane tab="已处理" key={String(EnumPostStatus.PUBLISHED)}>
          <List {...listProps} />
        </TabPane>
        <TabPane tab="待处理" key={String(EnumPostStatus.UNPUBLISH)}>
          <List {...listProps} />
        </TabPane>
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