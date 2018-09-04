import React, { Component, PropTypes } from 'react';
import { Input } from 'antd';
import { Table, Modal, Button, Pagination} from 'antd'
const error = Modal.error

class MapHandler extends Component {
    
    constructor(props) {
		super(props);
		this.state = {
		  str: "",
		  x: "",
		  y: "",
		};
	}

	componentWillReceiveProps(nextProps) {
		// console.log(nextProps.center)
	}
	
    setXY(address){
    	var self = this;
    	this.myGeo.getPoint(address, function(point){
				console.log(address)
			if (point) {
				self.map.centerAndZoom(point, 16);
				self.map.addOverlay(new BMap.Marker(point));
				const state = {x:point.lat, y:point.lng};
				self.setState(state);
				console.log(state)
				self.props.callback(state)
			}else{
				const state = {x:0, y:0};
				self.setState(state);
				console.log(state)
				self.props.callback(state)
			}
		}, self.props.center);
    }
    /*triggerChange(changedValue){
	    // Should provide an event to pass value to Form.
	    const onChange = this.props.onChange;
	    if (onChange) {
	      onChange(Object.assign({}, this.state, changedValue));
	    }
	  }*/
    getOptions() {
        return [
            'minZoom',
            'maxZoom',
            'mapType',
            'enableMapClick'
        ]
    }
    

    componentDidMount() {
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
        this.map.centerAndZoom(this.props.center||'',12);                   // 初始化地图,设置城市和地图级别。
        this.myGeo = new BMap.Geocoder();
		if(this.props.value){
			// console.log(this.props.value.str)
			this.setState({str:this.props.value.str})
		}
        this.forceUpdate();
        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
			{"input" : this.props.id
			,"location" : this.map
		});
    }
    render() {
        return (
        		<div ref='map' className={this.props.className} style={{width:0,height:0}}></div>
        );
    }
}

export default MapHandler;
