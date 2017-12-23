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
      width: 80,
      className: styles.avatar,
      render: (text, record) => <a onClick={e => viewItem(record.id, e)}>{text}</a>,
    }, {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text) => <span>{text=='1'?'待处理':'已处理'}</span>,
    }, {
      title: '金额',
      dataIndex: 'price',
      width: 60,
      key: 'price',
    },{
      title: '发货人',
      dataIndex: 'from.name',
      key: 'from.name',
      width: 100,
      render: (text) => <span>{text}</span>,
    }, {
      title: '发货地址',
      dataIndex: 'from.district',
      width: 200,
      key: 'from.district',
      render: (text) => <span>{text}</span>,
    }, {
      title: '电话',
      dataIndex: 'from.phone',
      width: 100,
      key: 'from.phone',
      render: (text) => <span>{text}</span>,
    }, /*{
      title: '收货人',
      dataIndex: 'to.name',
      key: 'to.name',
      render: (text, record) => <ul>{record.to.map(function(item){return <li>{item.name}</li>})}</ul>,
    }, */{
      title: '收货地址与收货人',
      dataIndex: 'to.address',
      width: 400,
      key: 'to.address',
      render: (text, record) => <ul>{record.to.map(function(item){return <li>{item.address.str+" : "+item.name}</li>})}</ul>,
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
      key: 'createTime',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record.id, e)} menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]} />
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
