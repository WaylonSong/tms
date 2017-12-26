import {AutoComplete, Icon} from 'antd'
import React, {
  Component,
  PropTypes
} from 'react';
import request from '../../utils/request'
import {APIV1} from '../../utils/config'
const Option = AutoComplete.Option;


class ACDriver extends Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      value: (this.props.value && this.props.value.name) ||'',
      id: this.props.id
    }
  }
  onSelect(value){
    this.setState({value: value})
  }

  
  triggerChange(changedValue){
    if(changedValue.trim() == "")
      this.props.onChange(undefined)
    else
      this.props.onChange({id: changedValue})
  }
  handleSearch = (value) => {
    var promise = request({
      url: `${APIV1}/drivers`,
      method: 'get',
      data: {name: value},
    })
    var self = this;
    promise.then(function(resp){
      self.setState({
        dataSource: resp.data.map((_)=>{return {id:_.id, name:_.name, phone:_.phone}})
      });
    })
  }
  renderOption = (item)=> {
    return (
      <Option key={item.id} text={item.name}>
        {<span><span><Icon type="user" />{item.name}</span><span style={{marginLeft:10}}><Icon type="phone"/>{item.phone}</span></span>}
      </Option>
    );
  }

  render() {
    const { dataSource } = this.state;
    return (
      <AutoComplete
        key={this.props.key}
        defaultValue={this.state.value}
        dataSource={dataSource.map(this.renderOption)}
        style={{ width: '100%', lineHeight:1.5 }}
        onSelect={this.onSelect.bind(this)}
        onSearch={this.handleSearch}
        onChange={this.triggerChange.bind(this)}
        optionLabelProp="text"
      />
    );
  }
}

export default ACDriver
