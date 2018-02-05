import React, { Component, PropTypes } from 'react';
import { Input, InputNumber } from 'antd';

class DistanceHandler extends Component {
    constructor(props) {
		super(props);
		const value = this.props.value||{value:0, from:'', to:''};
		this.state = {
		  value: value.value||0,
		  from: value.from||'',
		  to: value.to||''
		};
	}
	componentWillReceiveProps(nextProps) {
		var shouldUpdate = false;
		if(!nextProps || !nextProps.value)
			return
		if(nextProps.value['from'] == '' || nextProps.value['to'] == ''){
			return;
		}else{
			for (var key in nextProps.value){
				if(nextProps.value[key] != this.props.value[key]){
					shouldUpdate = true;
					break
				}
			}
			if (shouldUpdate) {
				// {from:"西单", to:"东单"};
				if(nextProps.value){
	  		  		this.transit.search(nextProps.value.from, nextProps.value.to);
				}
			}
		}
		
	}

    onChange(value){
    	this.setState({value: value});
    	this.triggerChange({value: value})
    }
    onChangeByValue(value){
    	this.setState({str: value});
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
		var options = this.options;
        options = this.getOptions(options);
        if (this.props.enableMapClick !== true) {
            options.enableMapClick = false;
        }
        var map = new BMap.Map(this.refs.map);
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
		var output = "";
		var self = this;
		var searchComplete = function (results){
			if (self.transit.getStatus() != BMAP_STATUS_SUCCESS){
				return ;
			}
			var plan = results.getPlan(0);
			output = plan.getDistance(true) //+ "\n";             //获取距离
		}
		var self = this;
		this.transit = new BMap.DrivingRoute(map, {renderOptions: {map: map},
			onSearchComplete: searchComplete,
			onPolylinesSet: function(){
				var distance = output.substring(0, output.length-2);
				self.onChange(distance)      
		}});
    }
    render() {
        return (
        	<div>
                <InputNumber id={this.props.id} onChange={this.onChange.bind(this)} disabled={this.props.disabled} min={0} value={this.state.value}></InputNumber>公里
        		<div ref='map' className={this.props.className} style={{width:0,height:0}}></div>
        	</div>
            
        );
    }
}

export default DistanceHandler;
