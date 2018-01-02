import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Button, Modal,message, Cascader, Row, Col, Card, Icon, Tooltip, Tabs, Steps, Pagination} from 'antd'
import city from '../../utils/city'
import VehicleList from './VehicleList'
import DistributingCard from './DistributingCard'
import DistributedCard from './DistributedCard'
import { connect } from 'dva'
import classnames from 'classnames'
import styles from './Modal.less'
import {EnumDeliveryStatus} from '../../utils/enums'
const confirm = Modal.confirm;

const TabPane = Tabs.TabPane

const status = ['待分配', '待接货', '配送中', '已送达'];

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

const SplitModal = ({
  item,
  modalType,
  onOk,
  onCancel,
  handleMinus,
  handleAdd,
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
    confirm({
      title: '',
      content: '确定拆分此运单',
      onOk() {
        validateFields((errors) => {
          if (errors) {
            return
          }
          var result = {id: item.id, splitCubes: getFieldValue("splitCubes")};

          const data = {
            ...result,
          }
          console.log(data)
          var totalCubes = 0;
          data.splitCubes.map((i)=>{
            totalCubes += i;
          })
          if(totalCubes != getFieldValue("cube")){
            message.error("拆分运单体积总量与原始运单不符！")
            return
          }
          onOk(data)
        })
      },
      onCancel() {
      },
    });
    
  }
  const handleCancel = ()=> {
    onCancel();
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    onCancel: handleCancel,
  }

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  const genList = () => {
      
    return item.splitCubes.map(function(i, index){
        var extra;
        if(index > 1){
          extra = <Tooltip title="删除运单"><Icon type="minus-circle-o" style={{ fontSize: 16, color: '#08c' }} onClick={handleMinus(i, index)}/></Tooltip>
        }
        if(index == item.splitCubes.length-1){
          extra = (<span>{extra}
            <Tooltip title="添加运单" ><Icon type="plus-circle-o" style={{ fontSize: 16, color: '#08c', cursor:"pointer", marginLeft:10}}  onClick={handleAdd}/></Tooltip></span>)
        }
        return  <Col xs={{ span: 24}} lg={{ span: 12}}>
            <Card style={{width: '100%'}} title={`拆分运单-${index+1}`} bordered={false} {...{extra}}>
              <FormItem label="货物体积"  {...formItemLayout}>
                {getFieldDecorator(`splitCubes[${index}]`, {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<InputNumber min={0} max={item.cube}/>)}<span>立方米</span>
              </FormItem>
            </Card>
          </Col>
    })
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
  const disableFlag = {
    disabled : true
  }
  return (
    <Modal title='运单拆分' width={1200} {...modalOpts}>
      <Form layout="horizontal">
        <Row gutter={24}>
          <Col xs={{ span: 24}} lg={{ span: 12}}>
            <Card style={{width: '100%'}} title="原始运单" bordered={false}>
              <FormItem label="发货区域" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from.district', {
                  initialValue: item.from.district && item.from.district.split(' '),
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="发货地址" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from.address', {
                  initialValue: item.from.address,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="发货人" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from.name', {
                  initialValue: item.from.name,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from.phone', {
                  initialValue: item.from.phone,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="货物体积" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cube', {
                  initialValue: item.cube,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
             
              <FormItem label="收货区域" hasFeedback {...formItemLayout}>
                {getFieldDecorator('to.district', {
                  initialValue: item.to.district && item.to.district.split(' '),
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="收货地址" hasFeedback {...formItemLayout}>
                {getFieldDecorator('from.address', {
                  initialValue: item.to.address,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="收货人" hasFeedback {...formItemLayout}>
                {getFieldDecorator('to.name', {
                  initialValue: item.to.name,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
              <FormItem label="电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('to.phone', {
                  initialValue: item.to.phone,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input {...disableFlag}/>)}
              </FormItem>
            </Card>
          </Col>
          {genList()}
        </Row>
      </Form>
    </Modal>
  )
}

SplitModal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}
export default connect(({ loading }) => ({ loading }))(Form.create()(SplitModal))

