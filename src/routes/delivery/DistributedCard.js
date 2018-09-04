import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col, Card, Icon, Tooltip, Tabs, Steps} from 'antd'
import city from '../../utils/city'
import {Map, PointLabel, DrivingRoute, Marker, MarkerList, NavigationControl, MapTypeControl, ScaleControl, OverviewMapControl, InfoWindow} from 'react-bmap'
import {simpleMapStyle} from '../../components/Map/mapstyle'
import VehicleAssignedMap from './VehicleAssignedMap'
import deliveryModal from '../../models/delivery/modal'
import VehicleList from './VehicleList'
import classnames from 'classnames'
import styles from './Modal.less'

const TabPane = Tabs.TabPane
const status = ['待分配', '待接货', '配送中', '已送达'];
// /*extra={<a href="#">刷新</a>}*/

const DistributedCard = ({
  viewProps,
}) => {
  return (
    <Card key={'car-distribution'} style={{width: '100%'}} title='运单起止与车辆轨迹' bordered={false} >
      <Col xs={{ span: 22, offset: 1}} lg={{ span: 22, offset: 1}}>
        {viewProps&&viewProps.currentItem&&
        	<VehicleAssignedMap viewProps={viewProps}/>}
      </Col>
    </Card>
  )
}

DistributedCard.propTypes = {
}
export default DistributedCard

