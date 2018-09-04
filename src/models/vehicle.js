/* global window */
import { crudModelGenerator } from './common'
import { queryAll, query, queryById, deleteAll, create, remove, update } from 'services/crud'
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

export default obj

