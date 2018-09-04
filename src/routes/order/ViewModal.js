import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, InputNumber, Radio, Modal, Cascader, Row, Col, Card, Icon, Tooltip} from 'antd'
import city from '../../utils/city'
import {getCode} from '../../utils/cityTools'
import ACInput from '../../components/Map/ACInput'
import Price from '../../components/Map/Price'
import DistanceHandler from '../../components/Map/DistanceHandler'
import {Collapse} from 'antd';
import {OrderDetailStateDict, EnumDeliveryStatusDict} from '../../utils/dict'
import {OrderDetailState, EnumDeliveryStatus} from '../../utils/enums'
import { routerRedux } from 'dva/router'
import {getFullName} from '../../utils/cityTools'


const Panel = Collapse.Panel;

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
  itemIndexes,
  onMinusTo,
  role,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue
  },
  ...modalProps
}) => {
  const modalOpts = {
    ...modalProps,
  }

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  const genOperButton = ()=>{
    let title = ''

    const OrderDetailState = {
      NOT_PAID : "待支付",
      NOT_DISTRIBUTED : "待分配",
      NOT_RECEIVED : "待接货",
      ONBOARD : "配送中",
      COMPLETED : "送货完成",
      CONFIRMED : "确认收货",
      INVALID : "已取消",
    }
    let nextState = ''
    /*if(role == "ADMIN"){
          title =  '取消订单';
          nextState = "INVALID"
    }else if(role == "CUSTOMER"){
      switch(item.state){
        case OrderDetailState.NOT_PAID:
          nextState = "NOT_DISTRIBUTED"
          title =  '确认付款';break;
        case OrderDetailState.NOT_RECEIVED:
          nextState = "ONBOARD"
          title =  '确认已装货';break;
        case OrderDetailState.COMPLETED:
          nextState = "CONFIRMED"
          title =  '确认收货';break;
      }
    }
    else if(role == "DRIVER"){
      switch(item.state){
        case OrderDetailState.NOT_DISTRIBUTED:
          title =  '确认接单';break;
        case OrderDetailState.ONBOARD:
          title =  '确认送达';break;
      }
    }*/
    if(item.state == "NOT_PAID"){
      return (<p><Button type="primary" onClick={modalProps.orderCancel}>取消订单</Button><span style={{marginLeft:10}}/>
        <Button type="primary" onClick={modalProps.toPay(item.payment.id)}>支付订单</Button>
      </p>);
    }else if(item.state == "NOT_DISTRIBUTED"||item.state == "NOT_RECEIVED"){
      return <Button type="primary" onClick={modalProps.orderCancel}>取消订单</Button>
    }
  }

  var disableFlag = {disabled:true}//{disabled:modalType=='view'}
  // getFieldDecorator('keys', { initialValue: [] });
  return (
    <Modal {...modalOpts} footer={<Button type="primary" onClick={modalProps.onCancel}>关闭</Button>} title={`订单编号：${item.id} [${EnumDeliveryStatus[item.state]}]`} width={1200} style={{}}>
      <Form layout="horizontal">
        <Row gutter={24}>
          <Col xs={{ span: 24}} lg={{ span: 12}}>
            <Card style={{width: '100%'}} title="发货方" bordered={false}>
              <FormItem label="省市区县" {...formItemLayout}>
                {getFieldDecorator('from.district', {
                  initialValue: getFullName(item.from.district) && getFullName(item.from.district).split(' '),
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Cascader
                  {...disableFlag}
                  size="large"
                  style={{ width: '100%' }}
                  options={city}
                  placeholder="请选择"
                />)}
              </FormItem>
              <FormItem label="详细地址" {...formItemLayout}>
                {getFieldDecorator('from.address', {
                  initialValue: item.from.address.str,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="发货人" {...formItemLayout}>
                {getFieldDecorator('from.name', {
                  initialValue: item.from.name,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="电话" {...formItemLayout}>
                {getFieldDecorator('from.phone', {
                  initialValue: item.from.phone,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              
            </Card>
          </Col>
          <Col xs={{ span: 24}} lg={{ span: 11, offset:1, pull:1}} key={`colCard`} style={{height:350}}>
            <Card key={`toCard`} style={{width: '100%'}} title={`货物详情`} bordered={false}>
             <FormItem label="物品详情描述" {...formItemLayout}>
                {getFieldDecorator(`item.cargoes[0].remark`, {
                  initialValue: item.cargoes[0].remark,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag} placeholder="简述货物情况，比如“洗衣机”"/>)}
              </FormItem>
              <FormItem label="物品尺寸" {...formItemLayout}>
                {getFieldDecorator(`cargoes[0].volume`, {
                  initialValue: item.cargoes[0].volume||0,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<InputNumber
                    {...disableFlag}
                    min={0}
                  />)}<span>立方米</span>
              </FormItem>
              <FormItem label="物品重量" {...formItemLayout}>
                {getFieldDecorator(`cargoes[0].weight`, {
                  initialValue: item.cargoes[0].weight||0,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<InputNumber
                    {...disableFlag}
                    min={0}
                  />)}<span>千克</span>
              </FormItem>
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={{ span: 24}} lg={{ span: 12}} key={`cargoCard`}>
            <Card key={`toCard`} style={{width: '100%'}} title={`收货方`} bordered={false}>
              <FormItem key={`to.district`} label="省市区县" {...formItemLayout}>
                {getFieldDecorator(`to.district`, {
                  initialValue: getFullName(item.to.district)&&getFullName(item.to.district).split(' '),
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Cascader
                  {...disableFlag}
                  size="large"
                  style={{ width: '100%' }}
                  options={city}
                  placeholder="请选择"
                />)}
              </FormItem>
              <FormItem key={`to.address`} label="详细地址" {...formItemLayout}>
                {getFieldDecorator(`to.address`, {
                  initialValue: item.to.address.str,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="收货人" {...formItemLayout}>
                {getFieldDecorator(`to.name`, {
                  initialValue: item.to.name,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="电话" {...formItemLayout}>
                {getFieldDecorator(`to.phone`, {
                  initialValue: item.to.phone,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
             {/* <FormItem label="物品详情描述" {...formItemLayout}>
                {getFieldDecorator(`to[${i}].detail`, {
                  initialValue: item.to[i].detail,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag} placeholder="简述货物情况，比如“洗衣机”"/>)}
              </FormItem>*/}
              <FormItem label="里程" {...formItemLayout}>
                {getFieldDecorator(`to.distance`, {
                  initialValue: {value:item.distance||0, to:item.to.address, from:item.from.address},
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<DistanceHandler
                    id={`to.distance`}
                    {...disableFlag}
                  />)}
              </FormItem>
            </Card>
          </Col>
          <Col xs={{ span: 24}} lg={{ span: 11, offset:1, pull:1}} style={{height:350}}>
            <Card style={{width: '100%'}} title="支付详情" bordered={false}>
              <FormItem label="运费金额" {...formItemLayout}>
                  {getFieldDecorator('payment.deliverPrice', {
                initialValue: item.payment.deliverPrice||0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  min={0}
                  {...disableFlag}
                />)}<span>元</span>
              </FormItem>
              <FormItem label="保价金额" {...formItemLayout}>
                  {getFieldDecorator('payment.insurancePrice', {
                initialValue: item.payment.insurancePrice||0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  min={0}
                  {...disableFlag}
                />)}<span>元</span>
              </FormItem>
              <FormItem label="支付状态" {...formItemLayout}>
                  {getFieldDecorator('payment.payState', {
                    initialValue: 0,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Radio.Group {...disableFlag}>
                  <Radio.Button value={0}>未支付</Radio.Button>
                  <Radio.Button value={1}>已支付</Radio.Button>
                </Radio.Group>)}
              </FormItem>
              <FormItem label="支付总额" {...formItemLayout}>
                  {getFieldDecorator('payment.payPrice', {
                initialValue: item.payment.payPrice||0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  min={0}
                  {...disableFlag}
                />)}<span>元</span>
              </FormItem>
            </Card>
          </Col>
        </Row>
        {(item.state != OrderDetailState.NOT_DISTRIBUTED || item.state != OrderDetailState.NOT_PAID)&& <Row gutter={24}>
          <Col xs={{ span: 24}} lg={{ span: 11, offset:1, pull:1}} >
            <Card style={{width: '100%'}} title="运单详情" bordered={false}>
              <Collapse accordion defaultActiveKey={[item.deliverOrders.length+""]}>
                {item.deliverOrders.map((i,index)=>{
                  return (
                    <Panel header={`运单编号：${i.id}`} key={index+1}>
                      <p>运单状态：{EnumDeliveryStatus[i.deliverOrderState]}</p>
                      <p>承运车辆：{i.vehicle.plateNumber}</p>
                      <p>司机名称：{i.driver.name}</p>
                      <p>运单金额：{i.deliverPrice}</p>
                      {i.deliverOrderState == "COMPLETED"?<p>完成时间：{i.completeTime}</p>:''}
                      <p><Button style={{marginTop:9}} onClick={modalProps.viewDelivery(`${i.id}`)}>查看详情</Button></p>
                    </Panel>
                  )
                })}
              </Collapse>
            </Card>
          </Col>
          <Col xs={{ span: 24}} lg={{ span: 11, offset:1, pull:1}} >
            <Card style={{width: '100%'}} title="订单操作" bordered={false}>
              {genOperButton()}
            </Card>
          </Col>
        </Row>}
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
