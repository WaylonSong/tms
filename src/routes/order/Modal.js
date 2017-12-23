import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col, Card, Icon, Tooltip} from 'antd'
import city from '../../utils/city'
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
  const calPrice = (cube, distance) =>{
    return 2 * cube * distance
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
    console.log(value);
    var params = {};
    for(var j = 0; j < itemIndexes.length; j++){
      params[`distance_${j}`] = {from: value.str, to:safeGetFieldValue('from_address').str};
    }
    setFieldsValue(
       params
    );
  }
  const handleToAddress = (i)=>(value)=>{
    var params = {};
    params[`distance_${i}`] = {from:safeGetFieldValue('from_address').str, to: value.str};
    setFieldsValue(
       params
    );
  }
  
  const handlePrice = (i)=>(value)=>{
    console.log("handlePrice:",i, value);
    var totalPrice = 0;
    for(var j = 0; j < itemIndexes.length; j++){
      if(i == j)
        totalPrice += Number(value)
      else
        totalPrice += Number(getFieldValue(`price_${j}`));
    }
    setFieldsValue(
       {price: totalPrice}
    );
  }
  const handleCargoPrice = (i)=>(value)=>{
    var totalPrice = 0;
    for(var j = 0; j < itemIndexes.length; j++){
      if(i == j)
        totalPrice += Number(value)
      else
        totalPrice += Number(getFieldValue(`cargo_price_${j}`));
    }
    setFieldsValue(
       {cargo_price: totalPrice}
    );
  }
  const handleCube = (i)=>(value)=>{
    var params = {};
    var price = calPrice(Number(value), Number(safeGetFieldValue(`distance_${i}`).value));
    if(isNaN(price))
      price = 0;
    params[`price_${i}`] = price
    setFieldsValue(
       params
    );
  }
  const handleDistance = (i)=>(value)=>{
    var params = {};
    var price = calPrice(Number(safeGetFieldValue(`cube_${i}`)), Number(value.value));
    if(isNaN(price))
      price = 0;
    params[`price_${i}`] = price
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

  var disableFlag = {disabled:modalType=='view'}

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
              {getFieldDecorator(`district_${i}`, {
                initialValue: item.to[i].district&&item.to[i].district.split(' '),
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
                onChange={handleDistrict(`district_${i}`)}
              />)}
            </FormItem>
            <FormItem key={`address_${i}`} label="详细地址" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`address_${i}`, {
                initialValue: item.to[i].address,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<ACInput id={`address_${i}`} center='贵阳' {...disableFlag} onChange={handleToAddress(i)}/>)}
            </FormItem>
            <FormItem label="收货人" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`name_${i}`, {
                initialValue: item.to[i].name,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input {...disableFlag}/>)}
            </FormItem>
            <FormItem label="电话" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`phone_${i}`, {
                initialValue: item.to[i].phone,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input {...disableFlag}/>)}
            </FormItem>
            <FormItem label="物品详情描述" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`detail_${i}`, {
                initialValue: item.to[i].detail,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input {...disableFlag} placeholder="简述货物情况，比如“洗衣机”"/>)}
            </FormItem>
            <FormItem label="里程测算" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`distance_${i}`, {
                initialValue: item.to[i].distance||0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<DistanceHandler
                  onChange={handleDistance(i)}
                  {...disableFlag}
                />)}
            </FormItem>
            <FormItem label="物品尺寸" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`cube_${i}`, {
                initialValue: item.to[i].cube||0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  {...disableFlag}
                  min={0}
                  onChange={handleCube(i)}
                />)}<span>立方米</span>
            </FormItem>
           
            <FormItem label="价格测算" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`price_${i}`, {
                initialValue: item.to[i].price||0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  {...disableFlag}
                  min={0}
                  onChange={handlePrice(i)}
                />)}<span>元</span>
            </FormItem>

            <FormItem label="捎带货款" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`cargo_price_${i}`, {
                initialValue: item.to[i].cargo_price||0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  {...disableFlag}
                  min={0}
                  onChange={handleCargoPrice(i)}
                />)}<span>元</span>
            </FormItem>

            {modalType == "view" &&
            <FormItem label="运单列表" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`deliveries`)(<ul>{item.to[i].deliveries.map((i)=><li style={{color:"blue", cursor:"pointer"}} onClick={onDirect(i)}>{i}</li>)}</ul>)}
            </FormItem>
            }  
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
                {getFieldDecorator('from_district', {
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
                  onChange={handleDistrict('from_district')}
                />)}
              </FormItem>
              <FormItem label="详细地址" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from_address', {
                  initialValue: item.from.address,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<ACInput id='from_address' center='贵阳' {...disableFlag} onChange={handleFromAddress}/>)}
              </FormItem>
              <FormItem label="发货人" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from_name', {
                  initialValue: item.from.name,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from_phone', {
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
          <Col xs={{ span: 24}} lg={{ span: 12}} style={{height:350}}>
            <Card style={{width: '100%'}} title="支付类型" bordered={false}>
              <FormItem label="支付类型" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('price_type', {
                    initialValue: item.price_type,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Radio.Group {...disableFlag} value={"large"}>
                  <Radio.Button value="在线支付">在线支付</Radio.Button>
                  <Radio.Button value="现金支付">现金支付</Radio.Button>
                  <Radio.Button value="回单支付">回单支付</Radio.Button>
                </Radio.Group>)}
              </FormItem>
              <FormItem label="订单总金额" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('price', {
                initialValue: item.price||0,
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
              <FormItem label="捎带货款总金额" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('cargo_price', {
                initialValue: item.cargo_price||0,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber
                  {...disableFlag}
                  disabled
                  min={0}
                />)}<span>元</span>
              </FormItem>
              <FormItem label="支付状态" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('price_status', {
                    initialValue: item.price_status,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Radio.Group value={"large"} {...disableFlag} onChange={()=>console.log()}>
                  <Radio.Button value="未支付">未支付</Radio.Button>
                  <Radio.Button value="已支付">已支付</Radio.Button>
                </Radio.Group>)}
              </FormItem>
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
