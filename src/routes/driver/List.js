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
      title: '操作',
      key: 'operation',
      width: 30,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record.id, e)} menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]} />
      },
    },{
      title: '驾驶证编号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      className: styles.avatar,
      // render: (text, record) => <a onClick={e => viewItem(record.id, e)}>{text}</a>,
    }, {
      title: '姓名',
      dataIndex: 'name',
      width: 50,
      key: 'name',
      render: (text) => <span>{text}</span>,
    }, {
      title: '所在车辆',
      dataIndex: 'number',
      width: 50,
      key: 'number',
      render: (text) => <span>{text}</span>,
    }, {
      title: '性别',
      dataIndex: 'gender',
      width: 50,
      key: 'gender',
      render: (text) => <span>{text}</span>,
    }, {
      title: '身份证',
      dataIndex: 'idCard',
      width: 80,
      key: 'idCard',
      render: (text) => <span>{text}</span>,
    },{
      title: '学历',
      dataIndex: 'education',
      width: 50,
      key: 'education',
      render: (text) => <span>{text}</span>,
    },{
      title: '银行卡',
      dataIndex: 'bankCard',
      width: 80,
      key: 'bankCard',
      render: (text) => <span>{text}</span>,
    }, {
      title: '电话',
      dataIndex: 'phone',
      width: 100,
      key: 'phone',
      render: (text) => <span>{text}</span>,
    },{
      title: '在岗状态',
      dataIndex: 'status',
      key: 'status',
      width: 50,
      render: (text, record) => <span>{text == 1? '当班':'休息'}</span>,
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
        scroll={{ x: 1200 }}
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
