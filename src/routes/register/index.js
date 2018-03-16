import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input, Radio, Select, Col, Checkbox } from 'antd'
import { config } from 'utils'
import styles from './index.less'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd';
import CustomerForm from './CustomerForm';
import DriverForm from './DriverForm';
const FormItem = Form.Item
const TabPane = Tabs.TabPane;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Register = ({
  dispatch,
  register,
  form: {
    getFieldValue,
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  let isCaptchaClicked = register['isCaptchaClicked'] || false;
  const loginJump = ()=>{
    dispatch(routerRedux.push({
      pathname: `/login`
    }))
  }
  const handleSubmit = ()=>{
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      onOk(values, 'customer');
      // dispatch({ type: 'login/login', payload: values })
    })
  }
  const onOk = (values, type)=>{
    console.log(values, type)
    dispatch({
      type: `register/register`,
      payload: {...values, registerType:type}
    })
  }
  const onCaptcha = ()=>{
    dispatch({
      type: `register/captcha`,
    })
  }
  const prefixSelector = getFieldDecorator('prefix', {
    initialValue: '86',
  })(
    <Select style={{ width: 60 }}>
      <Option value="86">+86</Option>
    </Select>
  );
  return (
    <div className={styles.registerForm}>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
        <span>用户注册</span>
      </div>
      <Form onSubmit={handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="手机号"
        >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '手机号不能为空！' }],
          })(
            <Input addonBefore={prefixSelector} style={{ width: '76%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="验证码"
          // extra="We must make sure that your are a human."
        >
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请填写验证码！' }],
              })(
                <Input />
              )}
            </Col>
            <Col span={12}>
              <Button onClick={onCaptcha} disabled={isCaptchaClicked}>获取验证码</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            rules: [{ required: true, message: '请仔细阅读并同意服务协议！' }],
          })(
            <Checkbox>我已经阅读了相关 <a href="#">协议</a></Checkbox>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" onClick={handleSubmit} >成为用户</Button>
        </FormItem>
      </Form>
      <Row type="flex" justify="center" style={{marginTop:10}}>
          <span><a onClick={loginJump}>马上登陆</a></span>
      </Row>
    </div>
  )
}

Register.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({register }) => ({register }))(Form.create()(Register))
