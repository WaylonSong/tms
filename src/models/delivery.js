/* global window */
import { crudModelGenerator } from './common'
import { queryAll, query, queryById, deleteAll, create, remove, update } from 'services/crud'
import { queryCandidateVehicles, assignTo, postSplit} from 'services/delivery'
import { querySituation } from 'services/vehicle' 
import {EnumDeliveryStatus} from '../utils/enums'
import queryString from 'query-string'
import pathToRegexp from 'path-to-regexp'

const resourceName = "delivery"
const collectionName = "deliveries"

var obj = crudModelGenerator(`${resourceName}`, `${collectionName}`)
// function addBlanckTo(state){}
// obj.state["item"] = {from:{},to:[{}]};
obj.state["distribut"] = {
	distributButtonDisabled: false,
	pagination: {
	  current: 1,
	  pageSize: 10,
	  total: 0,
	},
	candidateVehicles: []
}
obj.state["assignedVehicle"] = {}
obj.state["splitModalVisible"] = false;

obj.subscriptions = {
  setup ({ dispatch, history }) {
    history.listen((location) => {
      if (location.pathname === `/${resourceName}`) {
      	dispatch({
          type: 'hideModal',
        })
        const payload = location.query || queryString.parse(location.search)|| { page: 1, pageSize: 10 }
        dispatch({
          type: 'query',
          payload:{
            ...payload
          }
        })
      }else{
      	const match = pathToRegexp('/delivery/:id').exec(location.pathname)
		if (match) {
			dispatch({ type: 'editItem', payload: { id: match[1] } })
		}
      }
    })
  },
}


obj.reducers['showModal'] = (state, { payload }) => {
	return { ...state, ...payload, modalVisible: true}
}

obj.reducers['hideModal'] = (state, { payload }) => {
	return { ...state, modalVisible: false, splitModalVisible: false}
}

obj.reducers['showSplitModal'] = (state, { payload }) => {
	return { ...state, ...payload, splitModalVisible: true}
}

obj.reducers['updateItem'] = (state, { payload }) => {
	var currentItem = {};
	Object.assign(currentItem, state.currentItem);
	currentItem.status = EnumDeliveryStatus.NOT_RECEIVED;
	currentItem.vehicle = payload.vehicle_number;
	currentItem.driver.name = payload['driver.name'];
	currentItem.driver.phone = payload['driver.phone'];
	return { ...state, ...payload, currentItem}
}

obj.reducers['updateItemPending'] = (state, { payload }) => {
	var distribut = {};
	Object.assign(distribut, state.distribut);
	distribut.distributButtonDisabled = true;
	return { ...state, ...payload, distribut}
}

obj.reducers['addSplitCube'] = (state, { payload }) => {
	var currentItem = {};
	Object.assign(currentItem, state.currentItem);
	currentItem.splitCubes.push(0);
	// distribut.distributButtonDisabled = true;
	return { ...state, ...payload, currentItem}
}

obj.reducers['minusSplitCube'] = (state, { payload }) => {
	var currentItem = {};
	Object.assign(currentItem, state.currentItem);
	currentItem.splitCubes.splice(payload, 1);
	return { ...state, currentItem}
}

obj.effects['editItem'] = function *({ payload}, { call, put }){
	// payload.currentItemId
	const data = yield call(query, {id:payload.id}, `${collectionName}`)
	var putData = {
        type: `showModal`,
        payload: {
          modalType: payload.modalType,
          currentItem: data.data,
        }
    }
    if(data.data.deliverOrderState == "NOT_PAID"){
		yield put(putData)
    	return;
    }
	if(data.data.deliverOrderState != "NOT_DISTRIBUTED"){
		// const assignedVehicle = yield call(querySituation, {number:data.vehicle}, `vehicles`)
		// 查询候选车辆
		putData.payload['assignedVehicle'] = /*assignedVehicle.data[0]||*/{"vehicle":{"id":"130000199703110733","plateNumber":"贵N93121","status":1,"occupy":16,"type":"箱货","brand":"五菱","company":"党段型安名","location":{"x":116.424,"y":39.915}, "track":[{"x":116.384,"y":39.925},{"x":116.355,"y":39.930}, {"x":116.280,"y":39.927}, {"x":116.104,"y":39.905}]}, "driver":{id:1, name:"曹艳",phone:"17016385315"}};
		yield put(putData)
	}else{
		yield put({type: 'queryCandidateVehicles', payload, putData})
	}
}

obj.effects['splitItem'] = function *({ payload}, { call, put }){
	// payload.currentItemId
	const data = yield call(query, {id:payload.id}, `${collectionName}`)
	var putData = {
        type: `showSplitModal`,
        payload: {
          modalType: payload.modalType,
          currentItem: {...data.data, splitCubes:[0, 0]}
        }
    }
    yield put(putData)
}

obj.effects['postSplit'] = function *({ payload}, { call, put }){
	// payload.currentItemId
	/*const data = yield call(query, {id:payload.id}, `${collectionName}`)
	var putData = {
        type: `showSplitModal`,
        payload: {
          modalType: payload.modalType,
          currentItem: {...data, splitCubes:[0, 0]}
        }
    }*/
    yield call(postSplit, payload)
    yield put({type:'closeModalAndRefresh'})
}

obj.effects['queryCandidateVehicles'] = function *({payload, putData}, { call, put, select }){

	var putData2 = putData || {
        type: `showModal`,
        payload: {}
    }
	var vehicles = yield call(queryCandidateVehicles, {id:payload.id, page:payload.page||1, pageSize:payload.pageSize||10})

	if(vehicles.data){
		putData2.payload['distribut'] = {
          	candidateVehicles: vehicles.data.content,
			distributButtonDisabled: false,
			pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: vehicles.data.total,
            },
        }
		yield put(putData2)
	}
}

obj.effects['assignTo'] = function *({payload}, { call, put, select }){
	// payload.currentItemId
	console.log(payload)
	yield put({
		type: 'updateItemPending', 
	})
	const data = yield call(assignTo, payload) 
	// 指派成功 搜索现有车辆状态
	if(data){
		// yield put({type:'editItem', payload:{id:payload.id}})
		yield put({type:'closeModalAndRefresh'})
	}
}


export default obj

