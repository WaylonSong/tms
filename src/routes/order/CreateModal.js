import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col, Card, Icon, Tooltip} from 'antd'
import city from '../../utils/city'
import {getCode} from '../../utils/cityTools'
import ACInput from '../../components/Map/ACInput'
import Price from '../../components/Map/Price'
import DistanceHandler from '../../components/Map/DistanceHandler'

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
var handler = {};
const onFieldsChange = (props, fields)=>{
  var re = /\orders(.*)(payment.deliverPrice|payment.insurancePrice)/;
  if(re.test(Object.keys(fields)[0])){
    handler.setTotalPrice();
  }
}
const modal = ({
  item,
  modalType,
  itemIndexes,
  onOk,
  onAddBlankTo,
  onDirect,
  // onCancel,
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
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      var fieldsValue = getFieldsValue();
      var orders = fieldsValue.orders;
      //TODO： distance和district衍生值，update和create时 初始value处理不同
      for(var i in orders){
        orders[i].distance = orders[i].distance&&orders[i].distance.value||0
        orders[i].to.district = districtMap[`orders[${i}].district`] || getCode(orders[i].to.district[2])
      }
      fieldsValue.from.district = districtMap[`from.district`] || getCode(fieldsValue.from.district[2])
      const data = {
        ...fieldsValue,
        key: item.key,
      }
      onOk(data)
    })
  }
  
  const handleMinusTo = (i, counter)=>()=>{
    onMinusTo(counter)
  }

  const handleAddBlankTo = (nextI)=>()=>{
    onAddBlankTo();
  }
  
  const safeGetFieldValue = (name)=>{
    if(getFieldValue(name))
      return getFieldValue(name)
    else
      return ""
  }

  const calcTotalPrice = ()=>{
    let length = itemIndexes.length;
    let [insurancePrice, deliverPrice, payPrice] = [0, 0, 0];
    var totalPrice = 0;
    for(var j = 0; j < length; j++){
      insurancePrice += Number(safeGetFieldValue(`orders[${j}].payment.insurancePrice`));
      deliverPrice += Number(safeGetFieldValue(`orders[${j}].payment.deliverPrice`));
    }
    payPrice = insurancePrice+deliverPrice;
    return {insurancePrice, deliverPrice, payPrice};
  }

  handler.setTotalPrice = ()=>{
    let {insurancePrice, deliverPrice, payPrice} = calcTotalPrice();
    setFieldsValue(
      {
        "payment.deliverPrice": deliverPrice,
        "payment.insurancePrice": insurancePrice,
        "payment.payPrice": payPrice
      }
    );
  }

  
  const handleFromAddress = (value)=>{
    var params = {};
    for(var j = 0; j < itemIndexes.length; j++){
      params[`orders[${j}].distance`] = {from: value.str||'', to:safeGetFieldValue(`orders[${j}].to.address`).str||''};
    }
    setFieldsValue(
       params
    );
  }
  const handleToAddress = (i)=>(value)=>{
    var params = {};
    console.log(safeGetFieldValue('from.address').str||'')
    params[`orders[${i}].distance`] = {from:safeGetFieldValue('from.address').str||'', to: value.str||''};
    setFieldsValue(
       params
    );
  }

  const calDeliverPrice = (volume, distance) =>{
    return Number(2 * volume * distance).toFixed(2)
  }
  const handleVolume = (i)=>(value)=>{
    var params = {};
    var price = calDeliverPrice(Number(value), Number(safeGetFieldValue(`orders[${i}].distance`).value));
    if(isNaN(price))
      price = 0;
    params[`orders[${i}].payment.deliverPrice`] = price
    setFieldsValue(
       params
    );
  }
  const handleDistance = (i)=>(value)=>{
    var params = {};
    var price = calDeliverPrice(Number(safeGetFieldValue(`orders[${i}].cargoes[0].volume`)), Number(value.value));
    if(isNaN(price))
      price = 0;
    params[`orders[${i}].payment.deliverPrice`] = price
    setFieldsValue(
       params
    );
  }
  const handleDistrict = (key)=>(value, selectedOptions) => {
    districtMap[key] = selectedOptions[2]["id"]
  }
  
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  var disableFlag = {disabled:true}

  const genToList = () => {
    var list = itemIndexes.map((i, counter)=>{
      var extra;
      if(counter > 0 && modalType !="view"){
        extra = <Tooltip title="删除收货人"><Icon type="minus-circle-o" style={{ fontSize: 16, color: '#08c' }} onClick={handleMinusTo(i, counter)}/></Tooltip>
      }
      if(counter == itemIndexes.length-1  && modalType !="view"){
        extra = (<span>{extra}
          <Tooltip title="添加收货人" ><Icon type="plus-circle-o" style={{ fontSize: 16, color: '#08c', cursor:"pointer", marginLeft:10}}  onClick={handleAddBlankTo(i+1)}/></Tooltip></span>)
      }
      if(item.orders[i]){
      }else{
        item.orders[i] = {};
      }
      return(
        <Col xs={{ span: 24}} lg={{ span: 11, offset:1, pull:1}} key={`colCard-${i}`}>
          <Card key={`toCard-${i}`} style={{width: '100%'}} title={`收货方（${counter+1}）`} bordered={false} {...{extra}}>
            <FormItem key={`district_${i}`} label="省市区县" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`orders[${i}].to.district`, {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Cascader
               
                size="large"
                style={{ width: '100%' }}
                options={city}
                placeholder="请选择"
                onChange={handleDistrict(`orders[${i}].district`)}
              />)}
            </FormItem>
            <FormItem key={`address_${i}`} label="详细地址" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`orders[${i}].to.address`, {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<ACInput id={`orders[${i}].to.address`} center='贵阳' onChange={handleToAddress(i)}/>)}
            </FormItem>
            <FormItem label="收货人" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`orders[${i}].to.name`, {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input/>)}
            </FormItem>
            <FormItem label="电话" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`orders[${i}].to.phone`, {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input/>)}
            </FormItem>
            <FormItem label="里程测算" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`orders[${i}].distance`, {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<DistanceHandler
                  id={`orders[${i}].distance`}
                  onChange={handleDistance(i)}
                />)}
            </FormItem>
            <FormItem label="物品详情描述" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`orders[${i}].cargoes[0].remark`, {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input placeholder="简述货物情况，比如“洗衣机”"/>)}
            </FormItem>
            <FormItem label="物品尺寸" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`orders[${i}].cargoes[0].volume`, {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  min={0}
                  onChange={handleVolume(i)}
                />)}<span>立方米</span>
            </FormItem>
           <FormItem label="物品重量" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`orders[${i}].cargoes[0].weight`, {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  min={0}
                />)}<span>千克</span>
            </FormItem>
            <FormItem label="运费价格" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`orders[${i}].payment.deliverPrice`, {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  min={0}
                />)}<span>元</span>
            </FormItem>
            <FormItem label="保价金额" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`orders[${i}].payment.insurancePrice`, {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  min={0}
                />)}<span>元</span>
            </FormItem>
          </Card>
        </Col>
      )
    })
    return (
      <div>
        {list}
      </div>
    )
  }
  // getFieldDecorator('keys', { initialValue: [] });
  return (
    <Modal {...modalOpts} width={1200} style={{}}>
      <Form layout="horizontal">
        <Row gutter={24}>
          <Col xs={{ span: 24}} lg={{ span: 12}}>
            <Card style={{width: '100%'}} title="发货方" bordered={false}>
              <FormItem label="省市区县" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from.district', {
                  initialValue: item.from.district && item.from.district.split(' '),
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Cascader
                  size="large"
                  style={{ width: '100%' }}
                  options={city}
                  placeholder="请选择"
                  onChange={handleDistrict('from.district')}
                />)}
              </FormItem>
              <FormItem label="详细地址" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from.address', {
                  initialValue: item.from.address,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<ACInput id='from_address' center='贵阳' onChange={handleFromAddress}/>)}
              </FormItem>
              <FormItem label="发货人" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from.name', {
                  initialValue: item.from.name,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input/>)}
              </FormItem>
              <FormItem label="电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from.phone', {
                  initialValue: item.from.phone,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input/>)}
              </FormItem>
              
            </Card>
          </Col>
          <Col xs={{ span: 24}} lg={{ span: 12}} style={{height:350}}>
            <Card style={{width: '100%'}} title="支付类型" bordered={false}>
              <FormItem label="运费金额" {...formItemLayout}>
                  {getFieldDecorator('payment.deliverPrice', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  min={0}
                  disabled={true}
                />)}<span>元</span>
              </FormItem>
              <FormItem label="保价金额" {...formItemLayout}>
                  {getFieldDecorator('payment.insurancePrice', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  min={0}
                  disabled={true}
                />)}<span className={'some'}>元</span>
              </FormItem>
              <FormItem label="订单总额" {...formItemLayout}>
                  {getFieldDecorator('payment.payPrice', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  min={0}
                  disabled={true}
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
                  })(<Radio.Group  {...disableFlag}>
                  <Radio.Button value={0}>未支付</Radio.Button>
                  <Radio.Button value={1}>已支付</Radio.Button>
                </Radio.Group>)}
              </FormItem>
              {/*<FormItem label="捎带货款总金额" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('cargo_price', {
                initialValue: item.cargo_price||0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                 
                  disabled
                  min={0}
                />)}<span>元</span>
              </FormItem>*/}
            </Card>
          </Col>
          {genToList()}
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

export default Form.create({onFieldsChange:onFieldsChange})(modal)
