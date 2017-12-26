import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal,Select, Cascader, Row, Col, Card, Icon, Tooltip} from 'antd'
import city from '../../utils/city'
import ACInput from '../../components/Map/ACInput'
import Price from '../../components/Map/Price'
import DistanceHandler from '../../components/Map/DistanceHandler'

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
    if(modalType == "view")
      onOk("");
    else{
      validateFields((errors) => {
        if (errors) {
          return
        }
        var formData = getFieldsValue();
        const data = {
          ...formData,
          key: item.key,
        }
        console.log(data)
        onOk(data)
      })
    }
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 16, offset: 5 },
    },
  };
  
  const safeGetFieldValue = (name)=>{
    if(getFieldValue(name))
      return getFieldValue(name)
    else
      return ""
  }
  
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  var disableFlag = {disabled:modalType=='view'}

  const types = ["箱货", "货车", "平板", "面包车", "冷藏车"]

  const getDom = ()=>{
    return <Input {...disableFlag}/>;
  }

  const genToList = () => {
    var list = [];
    return list;
  }
  // getFieldDecorator('keys', { initialValue: [] });
  return (
    <Modal {...modalOpts} width={600} style={{}}>
      <Form layout="horizontal">
        <Row gutter={24}>
          <FormItem label="驾驶证编号" hasFeedback {...formItemLayout}>
            {getFieldDecorator('id', {
              initialValue: item.id||'',
              rules: [{required: true}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="姓名" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name||'',
              rules: [{required: true}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="所在车辆" hasFeedback {...formItemLayout}>
            {getFieldDecorator('number', {
              initialValue: item.number||'',
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="性别" hasFeedback {...formItemLayout}>
            {getFieldDecorator('gender', {
              initialValue: item.gender||'男',
              rules: [{required: true}],
            })(
              <Radio.Group defaultValue='男'>
                <Radio value='男'>男</Radio>
                <Radio value='女'>女</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="身份证" hasFeedback {...formItemLayout}>
            {getFieldDecorator('idCard', {
              initialValue: item.idCard||'',
              rules: [{required: true}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="学历" hasFeedback {...formItemLayout}>
            {getFieldDecorator('education', {
              initialValue: item.education||'',
              rules: [{required: true}],
            })(
              <Select><Option key='小学'>小学</Option><Option key='中学'>中学</Option><Option key='专科'>专科</Option><Option key='本科'>本科</Option><Option key='研究生及以上'>研究生及以上</Option></Select>
            )}
          </FormItem>
          <FormItem label="银行卡" hasFeedback {...formItemLayout}>
            {getFieldDecorator('bankCard', {
              initialValue: item.bankCard||'',
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="电话" hasFeedback {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: item.phone||'',
              rules: [{required: true}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="在岗状态" hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: item.status||0,
              rules: [{required: true}],
            })(
              <Radio.Group defaultValue={0}>
                <Radio value={0}>下班</Radio>
                <Radio value={1}>当班</Radio>
              </Radio.Group>
            )}
          </FormItem>
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
