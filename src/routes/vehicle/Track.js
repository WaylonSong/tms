import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col, Card, Icon, Tooltip} from 'antd'
import { connect } from 'dva'
import VehicleTrackView from './VehicleTrackView'
import GaugeComponent from './statistics/GaugeComponent'
import Temperature from './statistics/Temperature'
import Humidity from './statistics/Humidity'


const Track = ({vehicle, dispatch, history }) => {
  return (
    <div>
      <Card key={'track'} style={{width: '100%'}} title={'历史运行轨迹'} bordered={false} >
        <Col xs={{ span: 22, offset: 1}} lg={{ span: 22, offset: 1}}>
      	 {vehicle.item&&vehicle.item.number&&<VehicleTrackView vehicle={vehicle.item}/>||"请到列表中选择车辆"}
      	</Col>
      </Card>
      <Card key={'temperature'} style={{width: '100%'}} title={'车辆温度监控'} bordered={false} >
        <Col xs={{ span: 22, offset: 1}} lg={{ span: 22, offset: 1}}>
          <Temperature/>
        </Col>
      </Card>
      <Card key={'humidity'} style={{width: '100%'}} title={'车辆湿度监控'} bordered={false} >
        <Col xs={{ span: 22, offset: 1}} lg={{ span: 22, offset: 1}}>
          <Humidity/>
        </Col>
      </Card>
      <Card key={'gauge'} style={{width: '100%'}} title={'车辆仪表盘'} bordered={false} >
        <Col xs={{ span: 22, offset: 1}} lg={{ span: 22, offset: 1}}>
          <GaugeComponent/>
        </Col>
      </Card>
      
    </div>
  )
}

Track.propTypes = {
  /*form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,*/
}

export default connect(({ vehicle, loading }) => ({ vehicle, loading }))(Track)
