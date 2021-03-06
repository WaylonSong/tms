/* global window */
import { crudModelGenerator } from './common'
import { queryAll, query, queryById, deleteAll, create, remove, update } from 'services/crud'
import { stateTransfer, paid, cancel,  paymentByPaymentId} from 'services/order'
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
obj.effects['create'] = function *({ payload }, { call, put }) {
	const data = yield call(create, payload, collectionName)
	if (data.success) {
	  yield put({ type: 'hideModal' })
	  yield put({ type: 'query' })
	  const paymentId = data.data
	  console.log(paymentId)
	} else {
	  throw data
	}
}

obj.effects['editItem'] = function *({ payload}, { call, put }){
	// payload.currentItemId
	const data = yield call(query, {id: payload.currentItemId}, `${collectionName}`)
    if(data){
      yield put({
        type: `showViewModal`,
        payload: {
          modalType: payload.modalType,
          currentItem: data.data,
        },
      })
    }
}

obj.effects['pay'] = function *({ payload}, { call, put }){
	// payload.currentItemId
	console.log(payload.paymentId);
	const data = yield call(paymentByPaymentId, {paymentId: payload.paymentId}, `${collectionName}`)
	var paymentData = data.data;
    yield put({ type: `hideViewModal`})
    console.log(paymentData)
	// const data = yield call(query, {id:payload.currentItemId}, `${collectionName}`)
	// TODO：检查record状态
	if(data){
		yield put({
	        type: `showPayModalVisible`,
	        payload: {
	          payment:paymentData
	        },
	    })
	}
}

obj.effects['paid'] = function *({ payload}, { call, put }){

	// const data = yield call(payment, {id: payload.id}, `${collectionName}`)
	// var paymentData = data.data;
	yield call(paid, {id: payload.paymentId}, `${collectionName}`)
    yield put({ type: `hidePayModalVisible`})
    yield put({ type: 'query' })

}

obj.effects['orderCancel'] = function *({ payload}, { call, put }){
	const data = yield call(cancel, {id: payload.id}, `${collectionName}`)
    yield put({ type: `hideViewModal`})
    yield put({ type: 'query' })
}



obj.effects['nextState'] = function *({ payload}, { call, put }){
	const data = yield call(stateTransfer, {id: payload.id, state: payload.nextState}, `${collectionName}`)
    yield put({ type: `hideViewModal`})
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

