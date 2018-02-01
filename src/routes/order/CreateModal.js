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
    if(modalType == "view")
      onOk("");
    else{
      validateFields((errors) => {
        if (errors) {
          return
        }
        var fieldsValue = getFieldsValue();
        var tos = fieldsValue.to;
        //TODO： distance和district衍生值，update和create时 初始value处理不同
        for(var i in tos){
          tos[i].distance = tos[i].distance.value
          tos[i].district = districtMap[`to[${i}].district`] || getCode(tos[i].district[2])

        }
        fieldsValue.from.district = districtMap[`from.district`] || getCode(fieldsValue.from.district[2])
        const data = {
          ...fieldsValue,
          key: item.key,
        }
        onOk(data)
      })
    }
  }
  const calPrice = (volume, distance) =>{
    return Number(2 * volume * distance).toFixed(2)
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
  
  const handleFromAddress = (value)=>{
    var params = {};
    for(var j = 0; j < itemIndexes.length; j++){
      params[`to[${j}].distance`] = {from: value.str||'', to:safeGetFieldValue(`to[${j}].address`).str||''};
    }
    setFieldsValue(
       params
    );
  }
  const handleToAddress = (i)=>(value)=>{
    var params = {};
    params[`to[${i}].distance`] = {from:safeGetFieldValue('from.address').str||'', to: value.str||''};
    setFieldsValue(
       params
    );
  }
  
  const handlePrice = (i)=>(value)=>{
    var totalPrice = 0;
    for(var j = 0; j < itemIndexes.length; j++){
      if(i == j){
        totalPrice += Number(value)
      }
      else{
        totalPrice += Number(getFieldValue(`to[${j}].price`));
      }
    }
    setFieldsValue(
       {"payment.deliverPrice": totalPrice.toFixed(2)}
    );
  }
  const handleInsurancePrice = (i)=>(value)=>{
    setFieldsValue(
       {"payment.insurancePrice": calcTotalPrice(value, 'insurancePrice', i, itemIndexes.length)}
    );
  }
  const calcTotalPrice = (currentValue, key, index, length)=>{
    var totalPrice = 0;
    for(var j = 0; j < length; j++){
      if(index == j)
        totalPrice += Number(currentValue)
      else
        totalPrice += Number(getFieldValue(`to[${j}].${key}`));
    }
    return totalPrice.toFixed(2);
  }
  const handleVolume = (i)=>(value)=>{
    var params = {};
    var price = calPrice(Number(value), Number(safeGetFieldValue(`to[${i}].distance`).value));
    if(isNaN(price))
      price = 0;
    params[`to[${i}].price`] = price
    params[`price`] = calcTotalPrice(price, 'price', i, itemIndexes.length)
    setFieldsValue(
       params
    );
  }
  const handleDistance = (i)=>(value)=>{
    var params = {};
    var price = calPrice(Number(safeGetFieldValue(`to[${i}].volume`)), Number(value.value));
    if(isNaN(price))
      price = 0;
    params[`to[${i}].price`] = price
    params[`price`] = calcTotalPrice(price, 'price', i, itemIndexes.length)
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
      if(item.to[i]){
      }else{
        item.to[i] = {};
      }
      return(
        <Col xs={{ span: 24}} lg={{ span: 11, offset:1, pull:1}} key={`colCard-${i}`}>
          <Card key={`toCard-${i}`} style={{width: '100%'}} title={`收货方（${counter+1}）`} bordered={false} {...{extra}}>
            <FormItem key={`district_${i}`} label="省市区县" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`to[${i}].district`, {
                initialValue: item.to[i].district&&item.to[i].district.split(' '),
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
                onChange={handleDistrict(`to[${i}].district`)}
              />)}
            </FormItem>
            <FormItem key={`address_${i}`} label="详细地址" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`to[${i}].address`, {
                initialValue: item.to[i].address,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<ACInput id={`to[${i}].address`} center='贵阳' onChange={handleToAddress(i)}/>)}
            </FormItem>
            <FormItem label="收货人" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`to[${i}].name`, {
                initialValue: item.to[i].name,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input/>)}
            </FormItem>
            <FormItem label="电话" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`to[${i}].phone`, {
                initialValue: item.to[i].phone,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input/>)}
            </FormItem>
            <FormItem label="物品详情描述" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`to[${i}].detail`, {
                initialValue: item.to[i].detail,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input placeholder="简述货物情况，比如“洗衣机”"/>)}
            </FormItem>
            <FormItem label="里程测算" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`to[${i}].distance`, {
                initialValue: {value:item.to[i].distance||0, to:item.to[i].address, from:item.from.address},
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<DistanceHandler
                  id={`to[${i}].distance`}
                  onChange={handleDistance(i)}
                 
                />)}
            </FormItem>
            <FormItem label="物品尺寸" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`to[${i}].volume`, {
                initialValue: item.to[i].volume||0,
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
           
            <FormItem label="运费价格" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`to[${i}].price`, {
                initialValue: item.to[i].price||0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                 
                  min={0}
                  onChange={handlePrice(i)}
                />)}<span>元</span>
            </FormItem>

            <FormItem label="保价金额" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`to[${i}].insurancePrice`, {
                initialValue: item.to[i].insurancePrice||0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                 
                  min={0}
                  onChange={handleInsurancePrice(i)}
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
                />)}<span>元</span>
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

export default Form.create()(modal)
