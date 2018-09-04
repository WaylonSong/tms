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
  /*<Tabs defaultActiveKey="1" size={'small'}>
        <TabPane tab="支付宝" key="1" >
          <div style={{margin:0, textAlign: 'center'}}>
            <img src={paycode}/>
          </div>
        </TabPane>
        <TabPane tab="微信" key="2">微信二维码</TabPane>
      </Tabs>
  */
  console.log(modalProps.payment.no)
  return (
    <Modal {...modalProps} title={"合并支付 [支付编号："+modalProps.payment.no+"]"} width={800} style={{}} 
      footer={<Button type="primary" onClick={modalProps.onPaid(modalProps.payment.id)}>支付完成</Button>} 
    >
      <Row gutter={24}>
          <Col xs={{ span: 24}} lg={{ span: 12}}>
            <Card style={{width: '100%'}} title="关联订单" bordered={false}>
              <ul>
                {modalProps.payment.orderDetails&&modalProps.payment.orderDetails.map(item=>(<li>编号: {item.id} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 金额：{item.payPrice}</li>))}
              </ul>
            </Card>
          </Col>
          <Col xs={{ span: 24}} lg={{ span: 12}}>
            <Card style={{width: '100%'}} title="支付详情" bordered={false}>
              <p>订单应付金额：{modalProps.payment.payPrice || 0}元</p>
            </Card>
          </Col>
      </Row>

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
