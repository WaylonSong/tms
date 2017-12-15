import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm, Tabs } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import ACInput from '../../components/Map/ACInput'


import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmap'



const resourceName = "map";
const TabPane = Tabs.TabPane
const EnumPostStatus = {
  UNPUBLISH: 1,
  PUBLISHED: 2,
}

const Obj = (props) => {
  var {dispatch, loading, location } = props;
  var obj = props[resourceName];
  // const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys, itemIndexes } = obj
  // const { pageSize } = pagination
  // const { pathname } = location
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
  // var map = new BMap.Map("l-map");
  // map.centerAndZoom("北京",12);

  const parsed = queryString.parse(location.search);
  return (
    <div>
      <ACInput/>
    </div>

  )
}
Obj.propTypes = {
  // order: PropTypes.object,
  // location: PropTypes.object,
  // dispatch: PropTypes.func,
  // loading: PropTypes.object,
}

export default connect(({ order, loading }) => ({ order, loading }))(Obj)
