import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'

const confirm = Modal.confirm
const List = ({ resourceName, onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (recordId, e) => {
    if (e.key === '1') {
      onEditItem(recordId, 'update')
    } else if (e.key === '2') {
      confirm({
        title: '确认删除么？',
        onOk () {
          onDeleteItem(recordId)
        },
      })
    }
  }
  const viewItem = (record, e)=>{
    onEditItem(record, 'view');
  }
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
      width: 64,
      className: styles.avatar,
      render: (text, record) => <a onClick={e => viewItem(record.id, e)}>{text}</a>,
    }, {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <span>{text=='1'?'待处理':'已处理'}</span>,
    }, {
      title: '金额',
      dataIndex: 'price',
      key: 'price',
    },{
      title: '发货人',
      dataIndex: 'from_name',
      key: 'from_name',
      render: (text) => <span>{text}</span>,
    }, {
      title: '发货地址',
      dataIndex: 'from_district',
      key: 'from_district',
      render: (text) => <span>{text}</span>,
    }, {
      title: '电话',
      dataIndex: 'from_phone',
      key: 'from_phone',
      render: (text) => <span>{text}</span>,
    }, {
      title: '收货人',
      dataIndex: 'to_name',
      key: 'to_name',
      render: (text) => <span>{text}</span>,
    }, {
      title: '收货地址',
      dataIndex: 'to_address',
      key: 'to_address',
      render: (text) => <span>{text}</span>,
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record.id, e)} menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />
      },
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
