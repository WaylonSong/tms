import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch, Select} from 'antd'
import city from '../../utils/city'
import ACInput from '../../components/Map/ACInput'

const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search
const { RangePicker } = DatePicker
const options = ['id', 'from.name', 'from.address', 'from.phone', 'to.name', 'to.address', 'to.phone']
const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}
const Filter = ({
  addOrder, 
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {

  const handleFields = (fields) => {
    const { createTime, field, value} = fields
    if (createTime&&createTime.length) {
      fields.createTime = [createTime[0].format('YYYY-MM-DD'), createTime[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)

  }

  const handleReset = () => {
    const fields = getFieldsValue()
    console.log(fields);
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit();
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }
  return (
    <Row gutter={24}>
      <Col {...ColProps}  xl={{ span: 8 }} md={{ span: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {getFieldDecorator('field')(
          <Select style={{ width: '30%' }} size="large" placeholder="选择查询属性">
            <Option value={options[0]}>运单编号</Option>
            <Option value={options[1]}>发货人姓名</Option>
            <Option value={options[2]}>发货人地址</Option>
            <Option value={options[3]}>发货人电话</Option>
            <Option value={options[4]}>收货人姓名</Option>
            <Option value={options[5]}>收货人地址</Option>
            <Option value={options[6]}>收货人电话</Option>
          </Select>
          )}
          {getFieldDecorator('value')(
            <Search placeholder="搜索" style={{ width: '70%' }} size="large" onSearch={handleSubmit} />
          )}
        </div>
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
        <div style={{  justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <FilterItem label="创建时间">
            {getFieldDecorator('createTime')(
              <RangePicker style={{ width: '100%' }} size="large" onChange={handleChange.bind(null, 'createTime')}/>
            )}
          </FilterItem>
        </div>
      </Col>
        <Col xl={{ span: 4 }} md={{ span: 4 }}>
          <Button size="large" type={'primary'} style={{marginRight: 10}} onClick={handleSubmit}>查询</Button>
          <Button size="large" onClick={handleReset}>Reset</Button>
        </Col>
    </Row>
  )
}
Filter.propTypes = {
  // onAdd: PropTypes.func,
  // isMotion: PropTypes.bool,
  // switchIsMotion: PropTypes.func,
  // form: PropTypes.object,
  // filter: PropTypes.object,
  // onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
