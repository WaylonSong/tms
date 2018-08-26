import React from 'react'
import PropTypes from 'prop-types'
import city from '../../utils/city'
import { Form, Button, Input, InputNumber, Radio,Tabs, Modal, Row, Col, Card, Icon, Tooltip} from 'antd'
import paycode from '../../../assets/paycode.png'
const { TabPane } = Tabs;
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
  ...modalProps
}) => {
  // getFieldDecorator('keys', { initialValue: [] });
  // {...modalOpts}

  /*footer={<Button type="primary" onClick={modalProps.onCancel}>关闭</Button>} */
  return (
    <Modal {...modalProps}  width={600} style={{}} 
      footer={<Button type="primary" onClick={modalProps.onPayComplete}>支付完成</Button>} 
    >
      <Tabs defaultActiveKey="1" size={'small'}>
        <TabPane tab="支付宝" key="1" >
          <div style={{margin:0, textAlign: 'center'}}>
            <img src={paycode}/>
          </div>
        </TabPane>
        <TabPane tab="微信" key="2">微信二维码</TabPane>
      </Tabs>
    </Modal>
  )
}

modal.propTypes = {
  /*form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,*/
}

export default modal
