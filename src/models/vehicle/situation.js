/* global window */
/* global window */
// import { crudModelGenerator } from './common'
import vehicle from '../vehicle'
import pathToRegexp from 'path-to-regexp'
import { querySituation } from 'services/vehicle' 

const resourceName = "vehicle"
const collectionName = "vehicles"
var obj = Object.assign({},vehicle);
// function addBlanckTo(state){}
obj.namespace = "vehicleSituation";
obj.subscriptions = {
  setup ({ dispatch, history }) {
    history.listen(({ pathname }) => {
      	const match = pathToRegexp('/vehicle/:number/track').exec(location.pathname)
		if (match) {
			dispatch({
	          type: 'querySituation',
	          payload:{
	            number: match[1]	
	          }
	        })
		}
    })
  }
}

obj.effects['querySituation'] = function *({ payload}, { call, put }){
	// payload.currentItemId
	var putData = {
        type: `updateState`,
        payload: {
        	item:''
        }
    }
	if(payload.number != ":id"){
	    const result = yield call(querySituation, {number:payload.number}, `vehicles`)
	    putData.payload['item'] = result.data;
	}
	yield put(putData)
	console.log(putData)
}

export default obj

