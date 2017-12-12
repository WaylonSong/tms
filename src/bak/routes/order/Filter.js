import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch, Select} from 'antd'
import city from '../../utils/city'
const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search
const { RangePicker } = DatePicker
const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}
const Filter = ({addOrder,
  // onAdd,
  // isMotion,
  // switchIsMotion,
  // onFilterChange,
  // filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {

  const handleSubmit = () => {
    let fields = getFieldsValue()
    console.log(fields);
    // onFilterChange(fields)
  }
  const handleChange = () => {
    let fields = getFieldsValue()
    console.log(fields);
    // onFilterChange(fields)
  }

  return (
    <Row gutter={24}>
      <Col xl={{ span: 2 }} md={{ span: 4 }}>
        <Button style={{ width: '100%' }} size="large" type="primary" onClick={addOrder}>创建</Button>
      </Col>
      <Col {...ColProps}  xl={{ span: 8 }} md={{ span: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Select style={{ width: '30%' }} size="large" defaultValue="选择属性">
            <Option value="Zhejiang">Zhejiang</Option>
            <Option value="Jiangsu">Jiangsu</Option>
          </Select>
          {getFieldDecorator('query')(
            <Search placeholder="搜索" style={{ width: '70%' }} size="large" onSearch={handleSubmit} />
          )}
        </div>
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
        <div style={{  justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <FilterItem label="创建时间">
            {getFieldDecorator('createTime')(
              <RangePicker style={{ width: '100%' }} size="large" onChange={handleChange.bind(null, 'createTime')} />
            )}
          </FilterItem>
        </div>
      </Col>
        <Col xl={{ span: 2 }} md={{ span: 4 }}>
          <Button size="large" onClick={handleSubmit}>Reset</Button>
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
