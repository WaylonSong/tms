import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import styles from './index.less'
import { Form, Input, InputNumber, Radio, Button, Modal, Cascader, Row, Col, Card, Icon, Tooltip, Tabs, Steps, Pagination} from 'antd'
import { Page } from 'components'
import DistributedCard from '../DistributedCard'
import DistributingCard from '../DistributingCard'
import {EnumDeliveryStatus, getIndexByTitle} from '../../../utils/enums'

const Step = Steps.Step;
const Search = Input.Search

const Detail = ({delivery, dispatch, history,form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  }}) => {
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
  const ColProps = {
    xs: 24,
    sm: 12,
    style: {
      marginBottom: 16,
    },
  }
  const content = []
  const handleSubmit = () => {
    let fields = getFieldsValue()
    dispatch(routerRedux.push({
      pathname: `/delivery/${fields['value']}`
    }))
  }
  const item = currentItem;
  const genSteps = ()=>{
    if(item.deliverOrderState == "SPLITTED"){
      return (<Col xs={{ span: 16, offset: 1}} lg={{ span: 10, offset: 2}}><Steps current={2} className={styles.card}>
            <Step title="已创建" description={<div><div>{`货物体积(m³)：${item.cargoes[0].volume}`}</div><div>{`货物重量(kg)：${item.cargoes[0].weight}`}</div><div>{`货单金额(元)：${item.deliverPrice}`}</div><div>{`${item.createTime}`}</div></div>} />
            <Step title="已拆分" description={<ul>拆分子运单列表{item.subs.map((item)=><li>{item}</li>)}</ul>} />
          </Steps></Col>)
    }else return(
          <Steps current={getIndexByTitle(EnumDeliveryStatus, item.deliverOrderState)} className={styles.card}>
            <Step title="已创建" description={getIndexByTitle(EnumDeliveryStatus, item.deliverOrderState)>=0?<div><div>{`货物体积(m³)：${item.cargoes[0].volume}`}</div><div>{`货物重量(kg)：${item.cargoes[0].weight}`}</div><div>{`货单金额(元)：${item.deliverPrice}`}</div><div>{`${item.createTime}`}</div></div>:''} />
            <Step title="已支付" description={getIndexByTitle(EnumDeliveryStatus, item.deliverOrderState)>=0?<div><div>{`货单金额(元)：${item.deliverPrice}`}</div></div>:''} />
            <Step title="待接货" description={getIndexByTitle(EnumDeliveryStatus, item.deliverOrderState)>1?<div><div>{`分配车辆：${item.vehicle.plateNumber}`}</div><div>{`司机：${item.driver.name}`}</div><div>{`司机电话：${item.driver.phone}`}</div><div>{`${item.distributTime}`}</div></div>:''} />
            <Step title="配送中" description={getIndexByTitle(EnumDeliveryStatus, item.deliverOrderState)>2?<div><div>{`发货人：${item.from.name} ${item.from.phone}`}</div><div>{`发货地址：${item.from.address.str}`}</div><div>{`${item.loadTime}`}</div></div>:''} />
            <Step title="已完成" description={getIndexByTitle(EnumDeliveryStatus, item.deliverOrderState)>4?<div><div>{`收货人：${item.to.name} ${item.to.phone}`}</div><div>{`收货地址：${item.to.address.str}`}</div><div>{`${item.arriveTime}`}</div></div>:''} />
          </Steps>
      )
  }
  return( 
    <Page inner>
      <Row gutter={24} style={{textAlign:'left',marginBottom:30}}>
        <Col {...ColProps}  xl={{ span: 8 }} md={{ span: 8 }}>
          {getFieldDecorator('value')(
              <Search placeholder="搜索" style={{ width: '100%' }} size="large" onSearch={handleSubmit} />
          )}
        </Col>
      </Row>
      <Row gutter={24} style={{textAlign:'left',marginBottom:30}}>
        {`运单编号: ${item.id||"请搜索"} ${EnumDeliveryStatus[item.deliverOrderState]||''}`}
      </Row>
      <Row gutter={24} style={{marginBottom:20}}>
        {item.id&&genSteps()}
      </Row>
      <Row gutter={24}>
        {item.deliverOrderState == "NOT_DISTRIBUTED"&&<DistributingCard distributProps={distributProps}/>}
        {(item.deliverOrderState == "NOT_RECEIVED"||item.deliverOrderState == "ONBOARD")&&<DistributedCard viewProps={viewProps}/>}
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

export default connect(({ delivery, loading }) => ({ delivery, loading }))(Form.create()(Detail))
