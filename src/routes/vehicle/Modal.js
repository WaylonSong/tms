import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col, Card, Icon, Tooltip, Select, AutoComplete} from 'antd'
// import {columns} from './List'
import ACDriver from './ACDriver'
const Option = Select.Option;
// const options = ['id', 'plateNumber', 'vehicleSubType', 'brand', 'loads', 'driveLicense', 'operatorLicense', 'owner', 'ownerPhone']

const columns = [
    {
      title: '行驶证编号',
      dataIndex: 'driveLicense',
      key: 'driveLicense',
    }, {
      title: '车牌号码',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
    }, {
      title: '车辆状态',
      dataIndex: 'state',
      key: 'state',
    }, {
      title: '车型',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
    },{
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    }, {
      title: '载重',
      dataIndex: 'loads',
      key: 'loads',
    }, {
      title: '司机',
      dataIndex: 'drivers',
      key: 'drivers',
    },{
      title: '所属公司',
      dataIndex: 'company',
      key: 'company',
    }, {
      title: '车主',
      dataIndex: 'owner',
      key: 'owner',
    }, {
      title: '车主电话',
      dataIndex: 'ownerPhone',
      key: 'ownerPhone',
    },{
      title: '操作',
      key: 'operation',
    },
  ]
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
        formData.drivers = formData.drivers.filter((item)=>typeof(item)!='undefined')
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
    for(var i = 0; i < columns.length-1; i++){
      if(columns[i].title == '司机')
        continue;
      else if(columns[i].title == '车辆状态'){
        list.push(
          <FormItem label="车辆状态" hasFeedback {...formItemLayout}>
            {getFieldDecorator('state', {
              initialValue: item[columns[i].key]||"ON",
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Radio.Group>
                <Radio value={"OFF"}>下班</Radio>
                <Radio value={"ON"}>当班</Radio>
              </Radio.Group>
            )}
          </FormItem>
        );
      }else if(columns[i].title == '载重'){
        list.push(
            <FormItem label="载重" {...formItemLayout}>
                {getFieldDecorator(`loads`, {
                  initialValue: item[columns[i].key]||0,
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

        );
      }else{
        list.push(<FormItem label={columns[i].title} hasFeedback {...formItemLayout}>
          {getFieldDecorator(`${columns[i].key}`, {
            initialValue: item[columns[i].key],
            rules: [
              {
                required: true,
              },
            ],
          })(columns[i].title=='车型'?<Select {...disableFlag}>{types.map(function(j){return <Option key={`option_${j}`} value={j}>{j}</Option>})}</Select>:<Input {...disableFlag}/>)}
        </FormItem>)
      }
      
    }
    return list;
  }
  // getFieldDecorator('keys', { initialValue: [] });
  return (
    <Modal {...modalOpts} width={600} style={{}}>
      <Form layout="horizontal">
        <Row gutter={24}>
          {genToList()}
          <FormItem label='司机列表' hasFeedback {...formItemLayout}>
            {getFieldDecorator(`drivers[0]`, {
              initialValue: item['drivers']&&item['drivers'][0],
            })(<ACDriver key='drivers_0' {...disableFlag}/>)}
          </FormItem>
          <FormItem label='' key='drivers_1' hasFeedback {...formItemLayoutWithOutLabel}>
            {getFieldDecorator(`drivers[1]`, {
              initialValue: item['drivers']&&item['drivers'][1],
            })(<ACDriver key='drivers_1' {...disableFlag}/>)}
          </FormItem>
          <FormItem label='' key='drivers_2' hasFeedback {...formItemLayoutWithOutLabel}>
            {getFieldDecorator(`drivers[2]`, {
              initialValue: item['drivers']&&item['drivers'][2],
            })(<ACDriver key='drivers_2' {...disableFlag}/>)}
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
