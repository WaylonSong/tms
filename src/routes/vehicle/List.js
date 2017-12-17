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
      title: '行驶证编号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      className: styles.avatar,
      render: (text, record) => <a onClick={e => viewItem(record.id, e)}>{text}</a>,
    }, {
      title: '车牌号码',
      dataIndex: 'number',
      key: 'number',
      width: 80,
      className: styles.avatar,
      render: (text, record) => <a onClick={e => viewItem(record.id, e)}>{text}</a>,
    }, {
      title: '车辆状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text) => <span>{text=='1'?'上班':'下班'}</span>,
    }, {
      title: '车型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (text) => <span>{text}</span>,
    },{
      title: '车型',
      dataIndex: 'brand',
      key: 'brand',
      width: 80,
      render: (text) => <span>{text}</span>,
    }, {
      title: '载重',
      dataIndex: 'occupy',
      key: 'occupy',
      width: 80,
      render: (text) => <span>{text}吨</span>,
    }, {
      title: '司机',
      dataIndex: 'drivers',
      width: 120,
      key: 'drivers',
      render: (text) => <span>{text}</span>,
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
      dataIndex: 'phone',
      width: 100,
      key: 'phone',
      render: (text) => <span>{text}</span>,
    },{
      title: '操作',
      key: 'operation',
      width: 50,
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
