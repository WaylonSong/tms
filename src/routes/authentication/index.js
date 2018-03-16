import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input, Radio, Select, Col, Checkbox, Modal } from 'antd'
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

const Authentication = ({
  loading,
  dispatch,
  authentication,
  form: {
    getFieldValue,
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  const driverJump = ()=>{
    dispatch({
      type: `authentication/driver`
    })
  }
  const customerJump = ()=>{
    dispatch({
      type: `authentication/customer`
    })
  }
  const onOk = ()=>{
    Modal.error({
      title: '错误提示',
      content: '认证后台暂未开放，请直接登录！',
    });
    dispatch(routerRedux.push({
      pathname: `/login`
    }))
  }
  let user = "用户";
  if(authentication.type && authentication.type == 'driver')
    user = "司机";
  if(authentication.type && authentication.type == 'customer')
    user = "货主";
  return (
    <div>
      {user=='用户'&&
      <div className={styles.registerForm}>
        <div className={styles.logo}>
          <img alt={'logo'} src={config.logo} />
          <span>{user}认证</span>
        </div>
        <div>
          <Row type="flex" justify="center" style={{marginTop:10}}>
              <Button type="primary" onClick={driverJump} className="login-form-button">
                司机认证
              </Button>
          </Row>
          <Row type="flex" justify="center" style={{marginTop:10}}>
              <Button type="primary" onClick={customerJump} className="login-form-button">
                货主认证
              </Button>
          </Row>
        </div>
      </div>
    }
    {user=='司机'&&
      <div className={styles.driverForm}>
        <div className={styles.logo}>
          <img alt={'logo'} src={config.logo} />
          <span>{user}认证</span>
        </div>
        <DriverForm onOk={onOk}/>
      </div>
    }
    {user=='货主'&&
      <div className={styles.registerForm}>
        <div className={styles.logo}>
          <img alt={'logo'} src={config.logo} />
          <span>{user}认证</span>
        </div>
        <CustomerForm onOk={onOk}/>
      </div>
    }
    </div>
  )
}

Authentication.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading, authentication }) => ({ loading, authentication }))(Form.create()(Authentication))
