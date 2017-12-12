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
  const { query = {}, query2 = {}, pathname } = location
  const modalProps = {
    item: props[resourceName].modalType === 'create' ? {from:{},to:[{}]} : currentItem,
    itemIndexes,
    visible: props[resourceName].modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[resourceName+'/update'],
    title: props[resourceName].modalType === 'create' ? `Create ${resourceName}` : `Update ${resourceName}`,
    wrapresourceName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `${resourceName}/${modalType}`,
        payload: data,
      })
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
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: `${resourceName}/delete`,
        payload: id,
      })
    },
    onEditItem (item) {
      console.log("item:",item)
      dispatch({
        type: `${resourceName}/showModal`,
        payload: {
          modalType: 'update',
          currentItem: item,
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
      query: {
        status: key,
        filter: 'shipping'
      },
      query2: {
        status: key,
      },
      query3: {},
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
  }


  var activeKey = "";
  if(query2.status === String(EnumPostStatus.UNPUBLISH))
    activeKey = String(EnumPostStatus.UNPUBLISH)
  else if(query2.status === String(EnumPostStatus.PUBLISHED))
    activeKey = String(EnumPostStatus.PUBLISHED)
  return (
    <Page inner>
      {/*<Filter {...filterProps} />
      {modalVisible && <Modal {...modalProps} />}*/}
      <Tabs activeKey={activeKey} onTabClick={handleTabClick}>
        <TabPane tab="ALL" key={""}>
          <List {...listProps} />
        </TabPane>
        <TabPane tab="Publised" key={String(EnumPostStatus.PUBLISHED)}>
          <List {...listProps} />
        </TabPane>
        <TabPane tab="Unpublish" key={String(EnumPostStatus.UNPUBLISH)}>
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
