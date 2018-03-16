/* global window */
import { crudModelGenerator } from './common'
import { queryAll, query, queryById, deleteAll, create, remove, update } from 'services/crud'
import { stateTransfer } from 'services/order'

const resourceName = "order"
const collectionName = "orders"

var obj = crudModelGenerator(`${resourceName}`, `${collectionName}`)
// function addBlanckTo(state){}

obj.state["item"] = {from:{},to:[{}]};
obj.reducers['addBlanckTo'] = (state)=>  {
	var itemIndexes = [];
	Object.assign(itemIndexes, state.itemIndexes);
	itemIndexes.push(itemIndexes[itemIndexes.length-1]+1);
	return { ...state, itemIndexes}
}
obj.reducers['minusTo'] = (state, {payload})=>  {
	var itemIndexes = [];
	Object.assign(itemIndexes, state.itemIndexes);
	itemIndexes.splice(payload, 1);
	return { ...state, itemIndexes}
}

obj.reducers['showModal'] = (state, { payload }) => {
	var itemIndexes = [0];
	// itemIndexes.push(0);
	return { ...state, ...payload, modalVisible: true, itemIndexes}
}

obj.reducers['showViewModal'] = (state, { payload }) => {
	return { ...state, ...payload, viewModalVisible: true}
}

obj.reducers['hideViewModal'] = (state, { payload }) => {
	return { ...state, ...payload, viewModalVisible: false}
}


obj.reducers['showPayModalVisible'] = (state, { payload }) => {
	return { ...state, ...payload, payModalVisible: true}
}

obj.reducers['hidePayModalVisible'] = (state, { payload }) => {
	return { ...state, ...payload, payModalVisible: false}
}

obj.effects['pay'] = function *({ payload}, { call, put }){
	// payload.currentItemId
	const data = yield call(query, {id:payload.currentItemId}, `${collectionName}`)
	// TODO：检查record状态
	console.log("------------------");
	console.log(data)
	if(data){
		yield put({
        type: `showPayModalVisible`,
        payload: {
          currentItem: data,
        },
      })
	}
}
// obj.effects['showViewModal'] = function *({ payload}, { call, put }){
// 	// payload.currentItemId
// 	const data = yield call(query, {id:payload.currentItemId}, `${collectionName}`)
// 	if(data){
// 		yield put({
//         type: `showModal`,
//         payload: {
//           modalType: payload.modalType,
//           currentItem: data,
//         },
//       })
// 	}
// }

obj.effects['editItem'] = function *({ payload}, { call, put }){
	// payload.currentItemId
	console.log(payload.currentItemId);
	const data = yield call(query, {id: payload.currentItemId}, `${collectionName}`)
    if(data){
      yield put({
        type: `showViewModal`,
        payload: {
          modalType: payload.modalType,
          currentItem: data,
        },
      })
    }
}

obj.effects['nextState'] = function *({ payload}, { call, put }){
	// payload.currentItemId
	const data = yield call(stateTransfer, {id: payload.id, state: payload.nextState}, `${collectionName}`)
    yield put({type: `hideViewModal`})
    yield put({ type: 'query' })

    /*if(data){
		data.state = payload.nextState
      yield put({
        type: `update`,
        payload: data
      })
    }*/
}

export default obj

