import React, { Component, PropTypes } from 'react';
import { Input } from 'antd';
import { Table, Modal, Button, Pagination} from 'antd'
import MapHandler from './MapHandler'
const error = Modal.error

class ACInput extends Component {
    
    constructor(props) {
		super(props);
		const value = this.props.value || "";
		this.state = {
		  str: "",
		  x: "",
		  y: "",
		  center: this.props.center,
		  switch: true
		};
		this.ac = {};
	}
	componentWillReceiveProps(nextProps) {
		if(this.state.center != nextProps.center){
			this.setState({switch:!this.state.switch })
			this.setState({center:nextProps.center})

		}
		// console.log(this.state.center)
	}

    onChange(e){
    	this.setState({str: e.target.value});
    	this.refs['mapHandler'].setXY(e.target.value, this);
    }

    onChangeByValue(value){
    	this.setState({str: value});
    	this.refs['mapHandler'].setXY(value, this);
    }


    triggerChange(changedValue){
	    // Should provide an event to pass value to Form.
	    const onChange = this.props.onChange;
	    if (onChange) {
	      onChange(Object.assign({}, this.state, changedValue));
	    }
	}

    componentDidMount() {
    	this.ac = new BMap.Autocomplete(    //建立一个自动完成的对象
			{"input" : this.props.id
			,"location" : this.refs['mapHandler'].map
		});
		var self = this;
		this.ac.addEventListener("onconfirm", function(e) {  //鼠标放在下拉列表上的事件
			var value = e.item.value; 
			var _value = e.item.value;
			const myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			self.onChangeByValue(myValue)
		});
    	if(this.props.value && this.props.value.str)
			this.ac.setInputValue(this.props.value.str)
    }
    render() {
        return (
        	<div>
                <Input id={this.props.id} placeholder="输入地址" disabled={this.props.disabled} onChange={this.onChange.bind(this)} value={this.state.str}></Input>
        		<MapHandler center={this.state.center} ref="mapHandler" address={this.state.str} callback={this.triggerChange.bind(this)} />
        		{/*(!this.state.switch)&&<MapHandler center={this.state.center} ref="mapHandler" address={this.state.str} callback={this.triggerChange.bind(this)}/>*/}
        	</div>
            
        );
    }
}

export default ACInput;
