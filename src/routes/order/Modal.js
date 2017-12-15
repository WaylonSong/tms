import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col, Card, Icon, Tooltip} from 'antd'
import city from '../../utils/city'
import ACInput from '../../components/Map/ACInput'
import Price from '../../components/Map/Price'

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
    console.log(getFieldsValue())
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

  const handleMinusTo = (i, counter)=>()=>{
    onMinusTo(counter)
  }

  const handleAddBlankTo = (nextI)=>()=>{
    onAddBlankTo();
  }
  // const handlePrice = (i) => (value)=> {
  //   var price = {};
  //   price[`price-${i}`] = value * 27.5

  //   var params = {};
  //   params[`price-${i}`] = value * 27.5;
    
  //   if(i > 0){
  //     params[`priceCal-${i}`] = {from:getFieldValue('from-address').str, to:getFieldValue(`address-${i}`).str, cube: value};
  //   }else{
  //     i = -i;
  //     for(var j = 0; j < i; j++){
  //       params[`priceCal-${j}`] = {from:getFieldValue('from-address').str, to:getFieldValue(`address-${j}`).str, cube: value};
  //     }
  //   }
  //   setFieldsValue(
  //      params
  //   );
  // }
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
      params[`priceCal-${j}`] = {from: value, to:safeGetFieldValue(`address-${j}`).str, cube: safeGetFieldValue(`cube-${j}`).str};
    }
    setFieldsValue(
       params
    );
  }
  const handleToAddress = (i)=>(value)=>{
    var params = {};
    params[`priceCal-${i}`] = {from:safeGetFieldValue('from-address').str, to: value, cube: safeGetFieldValue(`cube-${i}`).str};
    setFieldsValue(
       params
    );
  }
  const handleCube = (i)=>(value)=>{
    var params = {};
    params[`priceCal-${i}`] = {from:safeGetFieldValue('from-address').str, to: safeGetFieldValue(`address-${i}`).str, cube: value};
    setFieldsValue(
       params
    );
  }

  const handleDistrict = (key)=>(value, selectedOptions) => {
    districtMap[key] = selectedOptions[2]["id"]
    console.log(districtMap)
  }
  const handleAddress =(key)=>()=>{
    console.log(key)
    return "from Modal"
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
            <FormItem key={`district-${i}`} label="省市区县" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`district-${i}`, {
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
                onChange={handleDistrict(`district-${i}`)}
              />)}
            </FormItem>
            <FormItem key={`address-${i}`} label="详细地址" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`address-${i}`, {
                initialValue: item.to[i].address,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<ACInput id={`address-${i}`} center='贵阳' {...disableFlag} onChange={handleToAddress(i)}/>)}
            </FormItem>
            <FormItem label="收货人" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`name-${i}`, {
                initialValue: item.to[i].name,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input {...disableFlag}/>)}
            </FormItem>
            <FormItem label="电话" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`phone-${i}`, {
                initialValue: item.to[i].phone,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input {...disableFlag}/>)}
            </FormItem>
            <FormItem label="物品详情描述" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`detail-${i}`, {
                initialValue: item.to[i].detail,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input {...disableFlag} placeholder="简述货物情况，比如“洗衣机”"/>)}
            </FormItem>
            <FormItem label="物品尺寸" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`cube-${i}`, {
                initialValue: item.to[i].cube,
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
           
            <FormItem label="价格" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`priceCal-${i}`)(<Price id={`priceCal-${i}`} center='贵阳' />)}
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
     {/* <ACInput/>*/}
      <Form layout="horizontal">
        <Row gutter={24}>
          <Col xs={{ span: 24}} lg={{ span: 12}}>
            <Card style={{width: '100%'}} title="发货方" bordered={false}>
              <FormItem label="省市区县" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from-district', {
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
                  onChange={handleDistrict('from-district')}
                />)}
              </FormItem>
              <FormItem label="详细地址" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from-address', {
                  initialValue: item.from.address,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<ACInput id='from-address' center='贵阳' {...disableFlag} onChange={handleFromAddress}/>)}
              </FormItem>
              <FormItem label="发货人" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from-name', {
                  initialValue: item.from.name,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from-phone', {
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
            <Card style={{width: '100%'}} title="订单确认" bordered={false}>
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
