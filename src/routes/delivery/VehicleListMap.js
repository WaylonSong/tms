import React, { Component, PropTypes } from 'react';
import { Input } from 'antd';
import {getFullName} from '../../utils/cityTools'

class OrderVehicleListView extends Component {
    constructor(props) {
		super(props);
		const value = this.props.value || "";
		this.state = {
		  candidateVehicles:[]
		};
	}
	componentWillReceiveProps(nextProps) {
        this.map.clearOverlays()
        this.routingAndVehicleLocation(nextProps)
	}
    getOptions() {
        return [
            'minZoom',
            'maxZoom',
            'mapType',
            'enableMapClick'
        ]
    }
    assignTo(id, driver, phone){
    	this.props.distributProps.assignTo(id, driver, phone)
    }
    openInfo(params, e, map){
    	var opts = {
			width : 250,     // 信息窗口宽度
			// height: 80,     // 信息窗口高度
			// title : "车辆详情" , // 信息窗口标题
			enableMessage:true//设置允许信息窗发送短息
		   };
		window.assignTo = this.assignTo.bind(this);
    	var p = e.target;
    	var self = this;
		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		var jsx = `<h2>车辆详情</h4><div>车牌号码：${params.plateNumber}</div><div>车型：${params.brand}-${params.vehicleType}</div><div>剩余空间：${params.loads}立方米</div>
					<div>司机：${params.driver.name}</div><div>司机手机：${params.driver.phone}</div>
					<div style='width:100%; text-align:center'>
						<input type='button' style='margin:10px; padding:10px; cursor:pointer;font-color:white' value='指派此车' 
							onclick='window.assignTo("${params.id}", "${params.driver.name}", "${params.driver.phone}")'>
					</div>`
		var infoWindow = new BMap.InfoWindow(jsx,opts);  // 创建信息窗口对象 
		map.openInfoWindow(infoWindow,point); //开启信息窗口
    }

    routingAndVehicleLocation(props){
        var driving = new BMap.DrivingRoute(this.map, {renderOptions: {map: this.map, panel: "r-result", autoViewport: true}});
        var item = props.distributProps.currentItem;

        var from = getFullName(item.from.district)+item.from.address.str;
        var to = getFullName(item.to.district)+item.to.address.str;
        // 北京市 东城区三里屯 北京 北京市 东城区天安门
        // driving.search(from.substring(from.indexOf(" ")), to.substring(to.indexOf(" ")));


        var vehicles = props.distributProps.distribut.candidateVehicles;
        var self = this;
        vehicles.map(function(item, i){
            var marker2 = new BMap.Marker(new BMap.Point(item.track[item.track.length-1].x, item.track[item.track.length-1].y),{icon:new BMap.Icon("/truck.png", new BMap.Size(50,50))});  // 创建标注
            marker2.setLabel(new BMap.Label(item.plateNumber, {offset:new BMap.Size(20,-10)}));
            self.map.addOverlay(marker2);
            marker2.addEventListener("click", function(e){
                self.openInfo(item, e, self.map)}
            );
        })

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
        map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));        
		map.addControl(new BMap.NavigationControl());     
        this.map.centerAndZoom(getFullName(this.props.distributProps.currentItem.from.district)||'北京',9);  
        this.routingAndVehicleLocation(this.props);
        
    }
    render() {
        return (
        	<div>
        		<div ref='map' className={this.props.className} style={{width:'100%',height:500}}></div>
        	</div>
            
        );
    }
}

export default OrderVehicleListView;
