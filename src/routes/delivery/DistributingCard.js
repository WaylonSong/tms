import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col, Card, Icon, Tooltip, Tabs, Steps, Pagination} from 'antd'
import city from '../../utils/city'
import {Map, PointLabel, DrivingRoute, Marker, MarkerList, NavigationControl, MapTypeControl, ScaleControl, OverviewMapControl, InfoWindow} from 'react-bmap'
import {simpleMapStyle} from '../../components/Map/mapstyle'
import VehicleListMap from './VehicleListMap'
import deliveryModal from '../../models/delivery/modal'
import VehicleList from './VehicleList'
import classnames from 'classnames'
import styles from './Modal.less'

const TabPane = Tabs.TabPane
const status = ['待分配', '待接货', '配送中', '已送达'];

const DistributingCard = ({
  distributProps,
}) => {
  // const handlePageChange = (page)=>{
  //   distributProps.onVehiclePageChange(page)
  // }

  return (
    <Card key={'car-distribution'} style={{width: '100%'}} title='车量调度' extra={<a href="#">刷新</a>} bordered={false} >
      <Tabs type="line" size='small' defaultActiveKey={'1'}>
        <TabPane tab="列表模式" key={1}>
          <VehicleList distributProps={distributProps}></VehicleList>
        </TabPane>  
        <TabPane tab="地图模式" key={2}>
          <Col xs={{ span: 22, offset: 1}} lg={{ span: 22, offset: 1}}>
            <VehicleListMap distributProps={distributProps}/>
          </Col>
        </TabPane>
      </Tabs>
      <Row type="flex" justify="center" align="middle" style={{marginTop:20}}>
        <Pagination defaultCurrent={1} total={50} onChange={distributProps.onVehiclePageChange}/>
      </Row>
      <Row>
      </Row>
    </Card>
  )
}

DistributingCard.propTypes = {
}
export default DistributingCard

