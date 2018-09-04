import React, { Component, PropTypes } from 'react';
import { Input } from 'antd';
import { Table, Modal, Button, Pagination} from 'antd'
const error = Modal.error

class ACInput extends Component {
    
    constructor(props) {
		super(props);
		const value = this.props.value || "";
		this.state = {
		  str: "",
		  x: "",
		  y: "",
		  center:"北京"
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({center:nextProps.center})
		console.log(this.state.center)
	}

    onChange(e){
    	this.setState({str: e.target.value});
    	this.setXY(e.target.value, this);
    }

    onChangeByValue(value){
    	this.setState({str: value});
    	// console.log("---------------"+value)
    	this.setXY(value, this);
    }

    setXY(address, self){
    	this.myGeo.getPoint(address, function(point){
			if (point) {
				self.map.centerAndZoom(point, 16);
				self.map.addOverlay(new BMap.Marker(point));
				const state = {x:point.lat, y:point.lng};
				self.setState(state);
				self.triggerChange(state)
			}else{
				const state = {x:0, y:0};
				self.setState(state);
				self.triggerChange(state)
			}
		}, self.props.center);
    }
    triggerChange(changedValue){
	    // Should provide an event to pass value to Form.
	    const onChange = this.props.onChange;
	    if (onChange) {
	      onChange(Object.assign({}, this.state, changedValue));
	    }
	  }
    getOptions() {
        return [
            'minZoom',
            'maxZoom',
            'mapType',
            'enableMapClick'
        ]
    }
    

    componentDidMount() {
    	console.log(this.state.center)
		var options = this.options;
        options = this.getOptions(options);
        if (this.props.enableMapClick !== true) {
            options.enableMapClick = false;
        }
        var map = new BMap.Map(this.refs.map, options);
        this.map = map;
        if (this.props.mapStyle) {
            map.setMapStyle(this.props.mapStyle);
        }
        /**/
        var zoom = this.props.zoom;
        this.map.centerAndZoom(this.state.center||'',12);                   // 初始化地图,设置城市和地图级别。
        this.myGeo = new BMap.Geocoder();
		if(this.props.value){
			// console.log(this.props.value.str)
			this.setState({str:this.props.value.str})
		}
        this.forceUpdate();
		var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
			{"input" : this.props.id
			,"location" : map
		});
		var self = this;
		ac.addEventListener("onconfirm", function(e) {  //鼠标放在下拉列表上的事件
			var value = e.item.value; 
			var _value = e.item.value;
			const myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			self.onChangeByValue(myValue)
		});

		if(this.props.value && this.props.value.str)
			ac.setInputValue(this.props.value.str)
    }
    render() {
        return (
        	<div>
                <Input id={this.props.id} placeholder="输入地址" disabled={this.props.disabled} onChange={this.onChange.bind(this)} value={this.state.str}></Input>
        		<div ref='map' className={this.props.className} style={{width:0,height:0}}></div>
        	</div>
            
        );
    }
}

export default ACInput;
