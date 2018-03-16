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
import SplitModal from './SplitModal'
import {EnumDeliveryStatus} from '../../utils/enums'
import {OrderDetailStateDict, EnumDeliveryStatusDict} from '../../utils/dict'

const resourceName = "delivery";
const TabPane = Tabs.TabPane

const options = ['id', 'from.name', 'from.address', 'from.phone', 'to.name', 'to.address', 'to.phone']

const Obj = (props) => {
  var {dispatch, loading, location } = props;
  var obj = props[resourceName];
  const { list, pagination, currentItem, modalVisible, splitModalVisible, modalType, isMotion, selectedRowKeys, itemIndexes, distribut, assignedVehicle } = obj
  const { pageSize } = pagination
  const { pathname } = location
  const query = queryString.parse(location.search);
  const distributProps = {
    currentItem,
    distribut,
    assignTo : (number, driver, driver_phone)=>{
      dispatch({
        type : 'delivery/assignTo',
        payload: {
          id: currentItem.id,
          vehicle_number: number,
          'driver.name':driver,
          'driver.phone':driver_phone
        }
      })
    },
    onVehiclePageChange: (page, pageSize)=>{
      dispatch({
        type : 'delivery/queryCandidateVehicles',
        payload : {
          page: page,
          id: currentItem.id
        }
      })
    }
  };
  const viewProps = {
    currentItem,
    assignedVehicle,
  };
  const modalProps = {
    item: props[resourceName].modalType === 'create' ? {from:{},to:[{}]} : currentItem,
    itemIndexes,
    distributProps,
    viewProps,
    visible: props[resourceName].modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[resourceName+'/update'],
    assignToLoading: loading.effects[resourceName+'/assignTo'],
    modalType: props[resourceName].modalType,
    wrapresourceName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: resourceName+'/closeModalAndRefresh',
      })
    },
    onCancel () {
      dispatch({
        type: resourceName+'/closeModalAndRefresh',
      })
    },
  }
  const splitModalProps = {
    // item: props[resourceName].modalType === 'create' ? {from:{},to:[{}]} : currentItem,,
    item: (()=>{
      /*console.log(props[resourceName].modalType)
      if(props[resourceName].modalType == 'split'){
        return {...currentItem, splitCubes:[0,0]};
      }
      else{
        return {...currentItem, splitCubes:[0,0]};
      }*/
      return currentItem
    })(),
    itemIndexes,
    distributProps,
    viewProps,
    visible: true,//props[resourceName].splitModalVisible,
    maskClosable: false,
    modalType: props[resourceName].modalType,
    wrapresourceName: 'vertical-center-modal',
    onOk (data) {
     /* dispatch({
        type: resourceName+'/postSplit',
        payload: data
      })*/
      onCancel();
    },
    onCancel () {
      dispatch({
        type: resourceName+'/closeModalAndRefresh',
      })
    },
    handleAdd(){
      dispatch({
        type: resourceName+'/addSplitCube',
      })
    },
    handleMinus:(i, counter)=>()=>{
      dispatch({
        type: resourceName+'/minusSplitCube',
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
    onEditItem (record, type) {
      if(type == "split"){
        dispatch({
          type: `${resourceName}/splitItem`,
          payload: {
            modalType: type,
            id: record.id,
          },
        })
      }
      else{
        dispatch({
          type: `${resourceName}/editItem`,
          payload: {
            modalType: type,
            id: record.id,
          },
        })
      }
    },
  }
  const handleTabClick = (key) => {
    var routes = {
      pathname,
      search: queryString.stringify({...query, deliverOrderState:key, page:1}),
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
      dispatch(routerRedux.push({
        search: queryString.stringify(params)
      }))
    },
  }
  let activeKey = "";
  if(query.deliverOrderState)
    activeKey = query.deliverOrderState;

  const parsed = queryString.parse(location.search);
  // console.log(location);
  return (
    <Page inner>
      <Filter {...filterProps} />
      {modalVisible && <Modal {...modalProps} />}
      {splitModalVisible && <SplitModal {...splitModalProps} />}

      <Tabs activeKey={activeKey} onTabClick={handleTabClick} size="small">
        <TabPane tab="全部" key={""}>
          <List {...listProps} />
        </TabPane>
        {EnumDeliveryStatusDict.map((i, index)=>{
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
  delivery: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ delivery, loading }) => ({ delivery, loading }))(Obj)
