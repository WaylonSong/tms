import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Input } from 'antd'
import { config } from 'utils'
import styles from './index.less'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd';
import CustomerForm from './CustomerForm';
import DriverForm from './DriverForm';
const TabPane = Tabs.TabPane;

const Register = ({
  loading,
  dispatch,
}) => {
  const loginJump = ()=>{
    dispatch(routerRedux.push({
      pathname: `/login`
    }))
  }
  const onOk = (values, type)=>{
    console.log(values, type)
    dispatch({
      type: `register/register`,
      payload: {...values, registerType:type}
    })

  }
  return (
    <div className={styles.form}>
      <Tabs type="card">
        <TabPane tab="成为货主" key="customer">
          <div className={styles.logo}>
            <img alt={'logo'} src={config.logo} />
            <span>货主注册</span>
          </div>
          <CustomerForm onOk = {onOk}/>
        </TabPane>
        <TabPane tab="成为司机" key="2">
          <div className={styles.logo}>
            <img alt={'logo'} src={config.logo} />
            <span>司机注册</span>
          </div>
          <DriverForm onOk = {onOk}/>
        </TabPane>
      </Tabs>
      <Row type="flex" justify="center" style={{marginTop:10}}>
          <span><a onClick={loginJump}>马上登陆</a></span>
      </Row>
    </div>
  )
}

Register.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading }) => ({ loading }))(Register)
