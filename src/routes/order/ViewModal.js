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

  var disableFlag = false//{disabled:modalType=='view'}
  // getFieldDecorator('keys', { initialValue: [] });
  return (
    <Modal {...modalOpts} footer={<Button type="primary" onClick={modalProps.onCancel}>关闭</Button>} title={`订单编号：${item.id} [${OrderDetailStateDict[item.state]}]`} width={1200} style={{}}>
      <Form layout="horizontal">
        <Row gutter={24}>
          <Col xs={{ span: 24}} lg={{ span: 12}}>
            <Card style={{width: '100%'}} title="发货方" bordered={false}>
              <FormItem label="省市区县" {...formItemLayout}>
                {getFieldDecorator('from.district', {
                  initialValue: item.from.district && item.from.district.split(' '),
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
                })(<Input/>)}
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
                  initialValue: item.to.district&&item.to.district.split(' '),
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
                })(<Input/>)}
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
            <Card style={{width: '100%'}} title="运单详情" bordered={false}>
              <Collapse accordion defaultActiveKey={[item.deliverOrders.length+""]}>
                {item.deliverOrders.map((i,index)=>{
                  return (
                    <Panel header={`运单编号：${i.id}`} key={index+1}>
                      <p>运单状态：{EnumDeliveryStatusDict[i.deliverOrderState]}</p>
                      <p>承运车辆：{i.vehicle.number}</p>
                      <p>司机名称：{i.driver.name}</p>
                      <p>运单金额：{i.price}</p>
                      {i.deliverOrderState == EnumDeliveryStatus.COMPLETED?<p>完成时间：{i.completeTime}</p>:''}
                    </Panel>
                  )
                })}
              </Collapse>
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
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
                />)}<span>元</span>
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
                />)}<span>元</span>
              </FormItem>
              <FormItem label="订单原价" {...formItemLayout}>
                  {getFieldDecorator('payment.originalPrice', {
                initialValue: item.payment.originalPrice||0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  {...disableFlag}
                  min={0}
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
            </Card>
          </Col>
        </Row>
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
