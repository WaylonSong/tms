import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import {EnumDeliveryStatus} from '../../utils/enums'

const status = ['待分配', '待接货', '配送中', '已送达', '已拆分'];

const confirm = Modal.confirm
const List = ({ resourceName, onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record, 'update')
    } else if (e.key === '2') {
      onEditItem(record, 'split')
    } else if (e.key === '3') {
      confirm({
        title: '确认删除么？',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }
  const viewItem = (record, e)=>{
    onEditItem(record, 'view');
  }
  const columns = [
    {
      title: '操作',
      key: 'operation',
      width: 30,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={record.status == EnumDeliveryStatus.NOT_DISTRIBUTED?[{ key: '1', name: '调度' }, { key: '2', name: '拆分' }]:[{ key: '1', name: '查看' }]} />
      },
    },{
      title: '运单编号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      className: styles.avatar,
      render: (text, record) => <a onClick={e => onEditItem(record, e)}>{text}</a>,
    }, {
      title: '运单状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text) => <span>{status[parseInt(text)]}</span>,
    }, {
      title: '订单金额',
      dataIndex: 'price',
      width: 60,
      key: 'price',
    },{
      title: '发货人',
      dataIndex: 'from.name',
      key: 'from.name',
      width: 80,
      render: (text) => <span>{text}</span>,
    }, {
      title: '发货人所在地',
      dataIndex: 'from.district',
      width: 200,
      key: 'from.district',
      render: (text) => <span>{text}</span>,
    }, {
      title: '发货地址',
      dataIndex: 'from.address',
      width: 200,
      key: 'from.address',
      render: (text) => <span>{text}</span>,
    }, {
      title: '发货人电话',
      dataIndex: 'from.phone',
      width: 120,
      key: 'from.phone',
      render: (text) => <span>{text}</span>,
    }, {
      title: '收货人',
      dataIndex: 'to.name',
      width: 80,
      key: 'to.name',
      render: (text) => <span>{text}</span>,
    }, {
      title: '收货人所在地',
      dataIndex: 'to.district',
      width: 200,
      key: 'to.district',
      render: (text) => <span>{text}</span>,
    },{
      title: '收货地址',
      dataIndex: 'to.address',
      width: 200,
      key: 'to.address',
      render: (text) => <span>{text}</span>,
    }, {
      title: '收货人电话',
      dataIndex: 'to.phone',
      width: 120,
      key: 'to.phone',
      render: (text) => <span>{text}</span>,
    }, {
      title: '货物体积(m³)',
      dataIndex: 'cube',
      width: 80,
      key: 'cube',
      render: (text) => <span>{text}</span>,
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
      key: 'createTime',
      render: (text) => <span>{text}</span>,
    }, {
      title: '分配时间',
      dataIndex: 'distributTime',
      width: 150,
      key: 'distributTime',
      render: (text, record) => <span>{parseInt(record.status) > 0?text:''}</span>,
    }, {
      title: '分配车辆',
      dataIndex: 'vehicle',
      key: 'vehicle',
      width: 100,
      render: (text, record) => <span>{record.status == EnumDeliveryStatus.NOT_DISTRIBUTED?'':text}</span>,
    }, {
      title: '司机',
      dataIndex: 'driver.name',
      key: 'driver.name',
      width: 100,
      render: (text, record) => <span>{record.status == EnumDeliveryStatus.NOT_DISTRIBUTED?'':text}</span>,
    }, {
      title: '司机电话',
      dataIndex: 'driver.phone',
      key: 'driver.phone',
      width: 100,
      render: (text, record) => <span>{record.status == EnumDeliveryStatus.NOT_DISTRIBUTED?'':text}</span>,
    },{
      title: '接货时间',
      dataIndex: 'loadTime',
      width: 150,
      key: 'loadTime',
      render: (text, record) => <span>{parseInt(record.status) > 1?text:''}</span>,
    }, {
      title: '送抵时间',
      dataIndex: 'arriveTime',
      width: 150,
      key: 'arriveTime',
      render: (text, record) => <span>{parseInt(record.status) == 3?text:''}</span>,
    }, 
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = (body) => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{ x: 2000 }}
        columns={columns}
        simple
        rowKey={record => record.id}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
