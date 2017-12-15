import React, { Component, PropTypes } from 'react';
import { Input, InputNumber } from 'antd';

class Price extends Component {
    constructor(props) {
		super(props);
		const value = this.props.value || 0
		this.state = {
		  value: value,
		  distance: 0,
		  cube: 0 
		};
	}
	async componentWillReceiveProps(nextProps) {
		if (nextProps.value) {
			// {from:"西单", to:"东单", cube: value};
  		  	await this.setState({cube: nextProps.value.cube});
			this.transit.search(nextProps.value.from, nextProps.value.to);
		}
	}
	calPrice(distance, weight){
		var result = (2*distance*weight).toFixed(2)
		if(isNaN(result))
			result = 0;
		return result;
	}

    onChange(value){
    	this.setState({value: value});
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
			// output += plan.getDuration(true) + "\n";                //获取时间
			// output += "总路程为：" ;
			output = plan.getDistance(true) //+ "\n";             //获取距离
		}
		var self = this;
		this.transit = new BMap.DrivingRoute(map, {renderOptions: {map: map},
			onSearchComplete: searchComplete,
			onPolylinesSet: function(){
				var distance = output.substring(0, output.length-2);
				self.setState({distance: distance, value: self.calPrice(distance, self.state.cube)})      
		}});
    }
    render() {
        return (
        	<div>
                <InputNumber id={this.props.id} onChange={this.onChange.bind(this)} disabled={this.props.disabled} min={0} value={this.state.value}></InputNumber>元
        		<div ref='map' className={this.props.className} style={{width:0,height:0}}></div>
        	</div>
            
        );
    }
}

export default Price;
