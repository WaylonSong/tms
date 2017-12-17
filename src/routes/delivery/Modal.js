import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col, Card, Icon, Tooltip, Tabs, Steps} from 'antd'
import city from '../../utils/city'
import ACInput from '../../components/Map/ACInput'
import Price from '../../components/Map/Price'
import {Map, PointLabel, DrivingRoute, Marker, MarkerList, NavigationControl, MapTypeControl, ScaleControl, OverviewMapControl} from 'react-bmap'
import {simpleMapStyle} from '../../components/Map/mapstyle'


import classnames from 'classnames'
import styles from './Modal.less'
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

const modal = ({
  item,
  modalType,
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
    // console.log(getFieldsValue())
    if(modalType == "view")
      onOk("");
    else{
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
          ...districtMap,
          key: item.key,
        }
        onOk(data)
      })
    }
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  var disableFlag = {disabled:modalType=='view'}

  const genList = () => {
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
  // getFieldDecorator('keys', { initialValue: [] });
  return (
    <Modal {...modalOpts} title={`运单编号 ${item.id} [${status[parseInt(item.status-1)]}]`} width={1200} style={{}}>
      <Row gutter={24} style={{marginBottom:20}}>
        <Col xs={{ span: 22, offset: 1}} lg={{ span: 22, offset: 1}}>
          <Steps current={parseInt(item.status)-1} className={styles.card}>
            <Step title="创建" description={<div><div>{`货物体积(m³)：${item.cube}`}</div><div>{`货单金额(元)：${item.price}`}</div><div>{`${item.createTime}`}</div></div>} />
            <Step title="分配" description={<div><div>{`分配车辆：${item.vehicle}`}</div><div>{`${item.distributTime}`}</div></div>} />
            <Step title="接货" description={<div><div>{`发货人：${item.from_name} ${item.from_phone}`}</div><div>{`发货地址：${item.from_district} ${item.from_address}`}</div><div>{`${item.loadTime}`}</div></div>} />
            <Step title="送达" description={<div><div>{`收货人：${item.to_name} ${item.to_phone}`}</div><div>{`收货地址：${item.to_district} ${item.to_address}`}</div><div>{`${item.arriveTime}`}</div></div>} />
          </Steps>
        </Col>
      </Row>
      <Row gutter={24}>
        <Card key={'car-distribution'} style={{width: '100%'}} title='车量调度' bordered={false} >
          <Tabs type="line" size='small' defaultActiveKey={2}>
            <TabPane tab="车辆列表" key={1}>
            1111
            </TabPane>
            <TabPane tab="地图模式" key={2}>
              <Col xs={{ span: 22, offset: 1}} lg={{ span: 22, offset: 1}}>
          <Map style={{height: '500px'}} mapStyle={simpleMapStyle} center={{lng: 116.403981, lat: 39.915599}} zoom='10'>
            <DrivingRoute start='天安门' end='百度大厦'/> 
            <NavigationControl />
            <MapTypeControl />
            <ScaleControl />
            <OverviewMapControl />
            <PointLabel data={[
                {
                    name: '京A12341',
                    index: 1,
                    color: 'red',
                    // isShowNumber: true,
                    // numberDirection: 'right',
                    point: {
                        lng: 116.35629191343,
                        lat: 39.923656708429
                    }
                },
                {
                    name: '京A12342',
                    index: 2,
                    color: 'red',
                    point: {
                        lng: 116.45165158593,
                        lat: 39.922979382266
                    }
                },
                {
                    name: '京A12343',
                    index: 3,
                    color: 'red',
                    point: {
                        lng: 116.3566138544,
                        lat: 39.907146730611
                    }
                },
                {
                    name: '京A12344',
                    index: 4,
                    color: 'red',
                    point: {
                        lng: 116.46007926258,
                        lat: 39.908464623343
                    }
                },
                {
                    name: '京A12345',
                    index: 5,
                    color: 'red',
                    point: {
                        lng: 116.5174653022,
                        lat: 39.923132911536
                    }
                },
                {
                    name: '京A12346',
                    index: 6,
                    color: 'red',
                    point: {
                        lng: 116.4283725021,
                        lat: 39.84602609593
                    }
                },
                {
                    name: '京A12347',
                    index: 7,
                    color: 'red',
                    point: {
                        lng: 116.3555775438,
                        lat: 39.940171435273
                    }
                },
                {
                    name: '京A12348',
                    index: 8,
                    color: 'red',
                    point: {
                        lng: 116.30623351961,
                        lat: 39.975748497825
                    }
                },
                {
                    name: '京A12349',
                    index: 9,
                    color: 'red',
                    point: {
                        lng: 116.46174509945,
                        lat: 39.933704360624
                    }
                },
                {
                    name: '京A12340',
                    index: 10,
                    color: 'rgb(51, 153, 255)',
                    point: {
                        lng: 116.32148092791,
                        lat: 39.967049268766
                    }
                }
            ]}
            changePosition={(point, index) => {
                console.log(point, index);
            }}
            />
          </Map>
        </Col>
            </TabPane>
          </Tabs>
        </Card>
        
             
      </Row>
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
