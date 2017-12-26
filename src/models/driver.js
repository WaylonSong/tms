/* global window */
import { crudModelGenerator } from './common'
import { queryAll, query, queryById, deleteAll, create, remove, update } from 'services/crud'
const resourceName = "driver"
const collectionName = "drivers"

var obj = crudModelGenerator(`${resourceName}`, `${collectionName}`)
// function addBlanckTo(state){}

obj.reducers['showModal'] = (state, { payload }) => {
	return { ...state, ...payload, modalVisible: true}
}

obj.effects['editItem'] = function *({ payload}, { call, put }){
	// payload.currentItemId
	const data = yield call(query, {id:payload.currentItemId}, `${collectionName}`)
	if(data){
		yield put({
        type: `showModal`,
        payload: {
          modalType: payload.modalType,
          currentItem: data,
        },
      })
	}
}

export default obj
