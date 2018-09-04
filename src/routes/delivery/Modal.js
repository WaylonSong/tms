import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Button, Modal, Cascader, Row, Col, Card, Icon, Tooltip, Tabs, Steps, Pagination} from 'antd'
import city from '../../utils/city'
import VehicleList from './VehicleList'
import DistributingCard from './DistributingCard'
import DistributedCard from './DistributedCard'
import { connect } from 'dva'
import classnames from 'classnames'
import styles from './Modal.less'
import {EnumDeliveryStatus, getIndexByTitle} from '../../utils/enums'
import {getFullName} from '../../utils/cityTools'

const TabPane = Tabs.TabPane

const Step = Steps.Step;

const Search = Input.Search

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
var districtMap = {}

const modal = ({
  item,
  modalType,
  onOk,
  onAddBlankTo,
  distributProps,
  viewProps,
  onMinusTo = ()=>console.log("Minus To"),
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue
  },
  ...modalProps
}) => {
  const handleOk = () => {
    // console.log(getFieldsValue())
    if(modalType == "view")
      onOk("");
    else{
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
          ...districtMap,
          key: item.key,
        }
        onOk(data)
      })
    }
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  var disableFlag = {disabled:modalType=='view'}

  const genList = () => {
  }
  const list = [{title:'运单号码', value: item.id}];
  const columns = [{
    title: '属性',
    dataIndex: 'title',
    key: 'title',
    width: 40,
  }, {
    title: '数值',
    key: 'value',
    dataIndex: 'value',
    width: 80,
  }]
  // getFieldDecorator('keys', { initialValue: [] });

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
  /*NOT_PAID : "待支付",
  NOT_DISTRIBUTED : "待分配",
  NOT_RECEIVED : "待接货", 
  ONBOARD : "配送中", 
  COMPLETED : "送货完成", 
  CONFIRMED : "确认收货",
  INVALID : "已取消",
  SPLITTED : "已拆分"*/
var OrderDetailStateDict = ["待支付", "待分配", "待接货", "配送中", "送货完成", "确认收货", "已取消", "已拆分"];

  return (
    <Modal {...modalOpts} title={`运单编号 ${item.id} [${EnumDeliveryStatus[item.deliverOrderState]}]`} cancelText={undefined} width={1200} style={{}} 
          footer={[
            <Button key="close" type="primary" onClick={onOk}>
              关闭
            </Button>,
          ]}>
      <Row gutter={24} style={{marginBottom:20}}>
        <Col xs={{ span: 22, offset: 1}} lg={{ span: 22, offset: 1}}>
          {genSteps()}
        </Col>
      </Row>
      <Row gutter={24}>
        {item.deliverOrderState == "NOT_DISTRIBUTED"&&<DistributingCard distributProps={distributProps}/>}
        {(item.deliverOrderState == "NOT_RECEIVED"||item.deliverOrderState == "ONBOARD")&&<DistributedCard viewProps={viewProps}/>}
      </Row>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}
export default connect(({ loading }) => ({ loading }))(Form.create()(modal))

