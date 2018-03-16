import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input, Radio, Select } from 'antd'
import { config } from 'utils'
import styles from './index.less'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd';
import Avatar from './Avatar';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item

const DriverForm = ({
  loading,
  onOk,
  form: {
    getFieldValue,
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      onOk(values, 'customer');
      // dispatch({ type: 'login/login', payload: values })
    })
  }
  const checkPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('password')) {
      callback('两次密码输入不一致');
    } else {
      callback();
    }
  }
  const checkMobile = (rule, value, callback) => {
    if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(value))){
      callback('请输入正确手机号码');
    }
    /*const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }*/
    callback();
  }


  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  return (
    <Form key='customer_form' layout='horizontal' style={{marginTop:10}}>
      <FormItem label='姓名' hasFeedback {...formItemLayout}>
        {getFieldDecorator('username', {
          rules: [
            {required: true,message:'姓名不能为空'},
          ],
        })(<Input size="large" onPressEnter={handleOk}  />)}
      </FormItem>
      <FormItem label='身份证号码' hasFeedback {...formItemLayout}>
        {getFieldDecorator('idCard', {
          rules: [
            {required: true,message:'身份证不能为空'},
          ],
        })(<Input size="large" onPressEnter={handleOk}  />)}
      </FormItem>
      <FormItem label='驾驶证编号' hasFeedback {...formItemLayout}>
        {getFieldDecorator('lisence', {
          rules: [
            {required: true,message:'驾驶证不能为空'},
          ],
        })(<Input size="large" onPressEnter={handleOk}  />)}
      </FormItem>
      <FormItem label='身份证正面' hasFeedback {...formItemLayout}>
        <Avatar style={{width:200}}/>
      </FormItem>
      <FormItem label='身份证反面' hasFeedback {...formItemLayout}>
        <Avatar style={{width:200}}/>
      </FormItem>
      <FormItem label='驾照第一页' hasFeedback {...formItemLayout}>
        <Avatar style={{width:200}}/>
      </FormItem>
      <FormItem label='行驶证第一页' hasFeedback {...formItemLayout}>
        <Avatar style={{width:200}}/>
      </FormItem>
      <Row type="flex" justify="center">
        <Button type="primary" onClick={handleOk} loading={loading.effects.register}>
          提交
        </Button>
      </Row>
    </Form>
  )
}
export default connect(({ loading }) => ({ loading }))(Form.create()(DriverForm))