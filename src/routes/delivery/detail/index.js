import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Form, Input, InputNumber, Radio, Button, Modal, Cascader, Row, Col, Card, Icon, Tooltip, Tabs, Steps, Pagination} from 'antd'
import { Page } from 'components'
import DistributedCard from '../DistributedCard'
import DistributingCard from '../DistributingCard'
import {EnumDeliveryStatus} from '../../../utils/enums'
const Step = Steps.Step;

const Detail = ({delivery, dispatch, history }) => {
  // console.log(dispatch)
  const { currentItem, distribut, assignedVehicle} = delivery
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
          currentItemId: currentItem.id
        }
      })
    }
  };
  const viewProps = {
    currentItem,
    assignedVehicle,
  };
  const content = []
  return( 
    <Page inner>
      <Row gutter={24} style={{textAlign:'left',marginBottom:30}}>
        <Button size="large" type={'primary'} style={{marginRight: 10}} onClick={()=>{history.goBack()}}>返回</Button>
      </Row>
      <Row gutter={24} style={{marginBottom:20}}>
        <Col xs={{ span: 22, offset: 1}} lg={{ span: 22, offset: 1}}>
          <Steps current={parseInt(currentItem.status)} className={styles.card}>
            <Step title="已创建" description={<div><div>{`货物体积(m³)：${currentItem.cube}`}</div><div>{`货单金额(元)：${currentItem.price}`}</div><div>{`${currentItem.createTime}`}</div></div>} />
            <Step title="已分配" description={parseInt(currentItem.status)>0?<div><div>{`分配车辆：${currentItem.vehicle}`}</div><div>{`司机：${currentItem.driver.name}`}</div><div>{`司机电话：${currentItem.driver.phone}`}</div><div>{`${currentItem.distributTime}`}</div></div>:''} />
            <Step title="已接货" description={parseInt(currentItem.status)>1?<div><div>{`发货人：${currentItem.from.name} ${currentItem.from.phone}`}</div><div>{`发货地址：${currentItem.from.district} ${currentItem.from.address}`}</div><div>{`${currentItem.loadTime}`}</div></div>:''} />
            <Step title="已送达" description={parseInt(currentItem.status)>2?<div><div>{`收货人：${currentItem.to.name} ${currentItem.to.phone}`}</div><div>{`收货地址：${currentItem.to.district} ${currentItem.to.address}`}</div><div>{`${currentItem.arriveTime}`}</div></div>:''} />
          </Steps>
        </Col>
      </Row>
      <Row gutter={24}>
        {currentItem.status == EnumDeliveryStatus.NOT_DISTRIBUTED&&<DistributingCard distributProps={distributProps}/>}
        {(currentItem.status == EnumDeliveryStatus.NOT_RECEIVED||currentItem.status == EnumDeliveryStatus.ONBOARD)&&<DistributedCard viewProps={viewProps}/>}
      </Row>
      <Row gutter={24} style={{textAlign:'center'}}>
        <Button size="large" type={'primary'} style={{marginRight: 10}} onClick={()=>{history.goBack()}}>返回</Button>
      </Row>
    </Page>
  )
}

Detail.propTypes = {
  userDetail: PropTypes.object,
}

export default connect(({ delivery, loading }) => ({ delivery, loading }))(Detail)
