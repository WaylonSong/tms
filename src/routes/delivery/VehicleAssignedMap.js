import React, { Component, PropTypes } from 'react';
import { Input } from 'antd';
import {getFullName} from '../../utils/cityTools'

class OrderVehicleAssignedView extends Component {
    constructor(props) {
		super(props);
	}
	componentWillReceiveProps(nextProps) {
	}
    getOptions() {
        return [
            'minZoom',
            'maxZoom',
            'mapType',
            'enableMapClick'
        ]
    }
    /*viewTrack(number){
        this.props.viewProps.viewTrack(number)
    }*/
    openInfo(params, e, map){
    	var opts = {
			width : 250,     // 信息窗口宽度
			// height: 80,     // 信息窗口高度
			// title : "车辆详情" , // 信息窗口标题
			enableMessage:true//设置允许信息窗发送短息
		   };
        // window.viewTrack = this.viewTrack.bind(this);
    	var p = e.target;
    	var self = this;
		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		var jsx = `<h2>当前派送车辆详情</h4><div>车牌号码：${params.number}</div><div>车型：${params.brand}-${params.type}</div><div>剩余空间：${params.occupy}立方米</div>
					<div>司机：${params.driver.name}</div><div>司机手机：${params.driver.phone}</div>
                    `
		var infoWindow = new BMap.InfoWindow(jsx,opts);  // 创建信息窗口对象 
		map.openInfoWindow(infoWindow,point); //开启信息窗口
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
        var driving = new BMap.DrivingRoute(map, {renderOptions: {map: map, panel: "r-result", autoViewport: true}});
        // driving.search("贵阳北站", "贵阳会展中心");
        // 测试，上线后换位实际运单地址
		var item = this.props.viewProps.currentItem;
        var from = getFullName(item.from.district)+item.from.address.str;
        var to = getFullName(item.to.district)+item.to.address.str;
        console.log(from, to);
        driving.search(from, to);
        // driving.search("昌平", "涞水");
		var zoom = this.props.zoom;
        this.map.centerAndZoom(this.props.center||'北京',12);   
        var item = this.props.viewProps.assignedVehicle;
        console.log(item);
        var self = this;

    	var marker2 = new BMap.Marker(new BMap.Point(item.vehicle.track[item.vehicle.track.length-1].x, item.vehicle.track[item.vehicle.track.length-1].y),{icon:new BMap.Icon("/truck.png", new BMap.Size(50,50))});  // 创建标注
        marker2.setLabel(new BMap.Label(item.vehicle.plateNumber, {offset:new BMap.Size(20,-10)}));
		map.addOverlay(marker2);
		marker2.addEventListener("click", function(e){
			self.openInfo(item, e, map)}
		)
        var points = [];
        points.push(new BMap.Point(item.vehicle.track[item.vehicle.track.length-1].x, item.vehicle.track[item.vehicle.track.length-1].y))
        item.vehicle.track.map(function(i){
            points.push(new BMap.Point(i.x, i.y))
        })
        //车辆轨迹
        var polyline = new BMap.Polyline(points, {strokeColor:"blue", strokeWeight:4, strokeOpacity:0.5});   //创建折线
        map.addOverlay(polyline);   //增加折线
         
    }
    render() {
        return (
        	<div>
        		<div ref='map' className={this.props.className} style={{width:'100%',height:500}}></div>
        	</div>
            
        );
    }
}

export default OrderVehicleAssignedView;
