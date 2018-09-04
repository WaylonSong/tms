import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Pagination} from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'

const status = ['待分配', '待接货', '配送中', '已送达'];

const confirm = Modal.confirm
const List = ({ distributProps }) => {
  // location.query = queryString.parse(location.search)
  const showConfirm = (record)=>()=>{
    confirm({
      title: '确定分批？',
      content: `确定分批给车辆“${record.plateNumber}”吗？`,
      onOk() {
        distributProps.assignTo(record.id, record.driver.id)
      },
      onCancel() {},
    });
  }
  const columns = [
    {
      title: '车牌号码',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      width: 80,
    }, {
      title: '当班司机',
      dataIndex: 'driver.name',
      width: 80,
      key: 'driver.name',
      render: (text) => <span>{text}</span>,
    }, {
      title: '电话',
      dataIndex: 'driver.phone',
      width: 120,
      key: 'driver.phone',
      render: (text) => <span>{text}</span>,
    }, {
      title: '车型',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      width: 80,
      render: (text) => <span>{text}</span>,
    }, {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 80,
      render: (text) => <span>{text}</span>,
    }, {
      title: '剩余载重',
      dataIndex: 'remainLoads',
      key: 'remainLoads',
      width: 80,
      // render: (record) => <span>{record.remainLoads||record.loads} 千克</span>,
      render: (text) => <span>{text+' 千克'}</span>,

    }, /*{
      title: '车辆位置',
      dataIndex: 'location',
      key: 'location',
      width: 80,
      render: (text) => <a href="#">查看</a>,
    }, */{
      title: '确认分配',
      dataIndex: 'submit',
      key: 'submit',
      width: 80,
      render: (text, record) => <Button type="primary" disabled={distributProps.distribut.distributButtonDisabled} onClick={showConfirm(record)}>指派</Button>,
    }
  ]
  const getBodyWrapperProps = {
    page: 8,
    current: 4,
  }

  return (
    <div>
      <Table
        dataSource={distributProps.distribut.candidateVehicles}
        className={classnames({ [styles.table]: true, })}
        bordered
        // scroll={{ x: 1800 }}
        pagination={false}
        columns={columns}
        simple
        rowKey={record => record.id}
        {...getBodyWrapperProps}
      />
    </div>
  )
}

List.propTypes = {
  assignTo: PropTypes.func,
  // onEditItem: PropTypes.func,
  // isMotion: PropTypes.bool,
  // location: PropTypes.object,
}

export default List
