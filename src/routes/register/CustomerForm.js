import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input,InputNumber } from 'antd'
import { config } from 'utils'
import styles from './index.less'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item

const CustomerForm = ({
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
      <FormItem label='手机号' hasFeedback {...formItemLayout}>
        {getFieldDecorator('mobile', {
          rules: [
            {required: true,message:'手机号不能为空'},
            {validator: checkMobile}
          ],
        })(<Input size="large" onPressEnter={handleOk}  />)}
      </FormItem>
      <FormItem label='姓名' hasFeedback {...formItemLayout}>
        {getFieldDecorator('username', {
          rules: [
            {required: true,message:'姓名不能为空'},
          ],
        })(<Input size="large" onPressEnter={handleOk}  />)}
      </FormItem>
      <FormItem label='所属单位' hasFeedback {...formItemLayout}>
        {getFieldDecorator('company', {
          /*rules: [
            {
              required: true,
            },
          ],*/
        })(<Input size="large" onPressEnter={handleOk}  />)}
      </FormItem>
      <FormItem label='密码' hasFeedback {...formItemLayout}>
        {getFieldDecorator('password', {
          rules: [
            {required: true,message:'密码不能为空'},
          ],
        })(<Input size="large" type="password" onPressEnter={handleOk} />)}
      </FormItem>
      <FormItem label='确认密码' hasFeedback {...formItemLayout}>
        {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '请确认密码!',
            }, {
              validator: checkPassword,
            }],
          })(
          <Input size="large" type="password" onBlur={console.log()} />
        )}
      </FormItem>
      <Row type="flex" justify="center">
        <Button type="primary" onClick={handleOk} loading={loading.effects.register}>
          提交
        </Button>
      </Row>
    </Form>
  )
}
export default connect(({ loading }) => ({ loading }))(Form.create()(CustomerForm))