import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import {EnumOnDutyType} from '../../utils/enums'

const confirm = Modal.confirm
const List = ({ resourceName, onDeleteItem, onEditItem, isMotion, location, onTrack, ...tableProps }) => {
  location.query = queryString.parse(location.search)
// const options = ['id', 'plateNumber', 'vehicleSubType', 'brand', 'loads', 'driveLicense', 'operatorLicense', 'owner', 'ownerPhone']

  const columns = [
    {
      title: '操作',
      key: 'operation',
      width: 50,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record.id, e)} menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '状态查看' }, { key: '3', name: '删除' }]} />
      },
    },{
      title: '行驶证编号',
      dataIndex: 'driveLicense',
      key: 'driveLicense',
      width: 80,
      className: styles.avatar,
      // render: (text, record) => <a onClick={e => viewItem(record.id, e)}>{text}</a>,
    }, {
      title: '车牌号码',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      width: 80,
      className: styles.avatar,
      // render: (text, record) => <a onClick={e => viewItem(record.id, e)}>{text}</a>,
    }, {
      title: '车辆状态',
      dataIndex: 'state',
      key: 'state',
      width: 80,
      render: (text) => <span>{EnumOnDutyType[text]}</span>,
    }, {
      title: '车型',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      width: 80,
      render: (text) => <span>{text}</span>,
    },{
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 80,
      render: (text) => <span>{text}</span>,
    }, {
      title: '载重',
      dataIndex: 'loads',
      key: 'loads',
      width: 80,
      render: (text) => <span>{text} 千克</span>,
    }, {
      title: '剩余载重',
      dataIndex: 'remainLoads',
      key: 'remainLoads',
      width: 80,
      render: (text) => <span>{text} 千克</span>,
    }, {
      title: '司机',
      dataIndex: 'drivers',
      width: 120,
      key: 'drivers',
      render: (text, record) => <ul>{record.drivers.map(function(item){return <li>{`${item.name}:${item.phone} \n `}</li>})}</ul>,
    },{
      title: '所属公司',
      dataIndex: 'company',
      key: 'company',
      width: 100,
      render: (text) => <span>{text}</span>,
    }, {
      title: '车主',
      dataIndex: 'owner',
      width: 50,
      key: 'owner',
      render: (text) => <span>{text}</span>,
    }, {
      title: '车主电话',
      dataIndex: 'ownerPhone',
      width: 100,
      key: 'ownerPhone',
      render: (text) => <span>{text}</span>,
    },
  ]

  const handleMenuClick = (recordId, e) => {
    if (e.key === '1') {
      onEditItem(recordId, 'update')
    } else if (e.key === '2') {
      onTrack(recordId)
    } else if (e.key === '3') {
      confirm({
        title: '确认删除么？',
        onOk () {
          onDeleteItem(recordId)
        },
      })
    }
  }
 
  

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
        style={{textAlign:'center'}}
        scroll={{ x: 1250 }}
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
