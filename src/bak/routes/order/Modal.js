import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col, Card, Icon, Tooltip} from 'antd'
import city from '../../utils/city'
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

const modal = ({
  item,
  itemIndexes,
  onOk,
  onAddBlankTo,
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
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      data.address = data.address.join(' ')
      onOk(data)
    })
  }

  const handleMinusTo = (i, counter)=>()=>{
    onMinusTo(counter)
  }

  const handleAddBlankTo = (nextI)=>()=>{
    onAddBlankTo();
  }
  const handlePrice = (i) => (value)=> {
    var price = {};
    price[`price-${i}`] = value * 27.5
    setFieldsValue(
       price
    );
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };


  const genToList = () => {
    console.log(itemIndexes);
    var list = itemIndexes.map((i, counter)=>{
      var extra;
      if(counter > 0){
        extra = <Tooltip title="删除收货人"><Icon type="minus-circle-o" style={{ fontSize: 16, color: '#08c' }} onClick={handleMinusTo(i, counter)}/></Tooltip>
      }
      if(counter == itemIndexes.length-1){
        extra = (<span>{extra}
          <Tooltip title="添加收货人" ><Icon type="plus-circle-o" style={{ fontSize: 16, color: '#08c', cursor:"pointer", marginLeft:10}}  onClick={handleAddBlankTo(i+1)}/></Tooltip></span>)
      }
      console.log(item);
      return(
        <Col xs={{ span: 24}} lg={{ span: 11, offset:1, pull:1}} key={`colCard-${i}`}>
          <Card key={`toCard-${i}`} style={{width: '100%'}} title={`收货方（${counter+1}）`} bordered={false} {...{extra}}>
            <FormItem key={`district-${i}`} label="省市区县" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`district-${i}`, {
                // initialValue: i.district && i.district.split(' '),
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
              />)}
            </FormItem>
            <FormItem key={`address-${i}`} label="详细地址" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`address-${i}`, {
                initialValue: i.address,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input/>)}
            </FormItem>
            <FormItem label="收货人" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`name-${i}`, {
                initialValue: i.name,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input/>)}
            </FormItem>
            <FormItem label="电话" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`phone-${i}`, {
                initialValue: item.to[i].phone,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input/>)}
            </FormItem>
            <FormItem label="物品详情描述" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`detail-${i}`, {
                initialValue: i.detail,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input placeholder="简述货物情况，比如“洗衣机”"/>)}
            </FormItem>
            <FormItem label="物品尺寸" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`cube-${i}`, {
                initialValue: i.cube,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<div><InputNumber
                  initialValue={0}
                  min={0}
                  onChange={handlePrice(i)}
                /><span>立方米</span></div>)}
            </FormItem>
            <FormItem label="价格" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`price-${i}`, {
                initialValue: i.price,
              })(<InputNumber
                  initialValue={0}
                  disabled
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
    <Modal {...modalOpts} width={1200}>
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
                  size="large"
                  style={{ width: '100%' }}
                  options={city}
                  placeholder="请选择"
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
                })(<Input/>)}
              </FormItem>
              <FormItem label="发货人" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from-name', {
                  initialValue: item.from.name,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input/>)}
              </FormItem>
              <FormItem label="电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from-phone', {
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
