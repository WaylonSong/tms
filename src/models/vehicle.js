/* global window */
import { crudModelGenerator } from './common'
import { queryAll, query, queryById, deleteAll, create, remove, update } from 'services/crud'
import { querySituation } from 'services/vehicle' 
import queryString from 'query-string'
import pathToRegexp from 'path-to-regexp'
const resourceName = "vehicle"
const collectionName = "vehicles"

var obj = crudModelGenerator(`${resourceName}`, `${collectionName}`)
// function addBlanckTo(state){}
obj.subscriptions = {
  setup ({ dispatch, history }) {
    history.listen((location) => {
      if (location.pathname === `/${resourceName}`) {
        const payload = location.query || queryString.parse(location.search)|| { page: 1, pageSize: 10 }
        dispatch({
          type: 'query',
          payload:{
            ...payload
          }
        })
      }else{
      	const match = pathToRegexp('/vehicle/:number/track').exec(location.pathname)
		if (match) {
			dispatch({
	          type: 'querySituation',
	          payload:{
	            number: match[1]	
	          }
	        })
		}
      }
    })
  },
}


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
          currentItem: data.data,
        },
      })
	}
}

obj.effects['querySituation'] = function *({ payload}, { call, put }){
	// payload.currentItemId
	var putData = {
        type: `updateState`,
        payload: {
        }
    }
	const result = yield call(querySituation, {number:payload.number}, `vehicles`)
	putData.payload['item'] = result.data;
	console.log(payload.number, putData)
	yield put(putData)
}

export default obj

