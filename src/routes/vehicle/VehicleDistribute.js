import React, { Component, PropTypes } from 'react';
import VehicleMap from './VehicleMap'
import { request, config } from 'utils'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col, Card, Icon, Tooltip, Tabs, Steps, Pagination} from 'antd'
class VehicleDistribute extends Component {
    constructor(props) {
		super(props);
        this.state = {
            vehicles: [],
            total: 0
        }
	}
    fetch(page=1){
        var self = this;
        this.promise = request({
            page : page,
            url:config.api.locationList,
        }).then((result) => {
            var vehicles = result.data;
            var total = result.total;
            this.setState({vehicles, total});
        })
    }
	
    componentDidMount() {
        this.fetch();
    }
    render() {
        return (
        	<Card key={'car-distribution'} style={{width: '100%'}} title='车辆列表' bordered={false} >
              <VehicleMap vehicles={this.state.vehicles}/>
              <Row type="flex" justify="center" align="middle" style={{marginTop:20}}>
                <Pagination defaultCurrent={1} total={this.state.total} onChange={this.fetch.bind(this)}/>
              </Row>
              <Row>
              </Row>
            </Card>
        );
    }
}

export default VehicleDistribute;
