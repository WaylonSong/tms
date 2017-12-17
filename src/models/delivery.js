/* global window */
import { crudModelGenerator } from './common'
import { queryAll, query, queryById, deleteAll, create, remove, update } from 'services/crud'
const resourceName = "delivery"
const collectionName = "deliveries"

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
	var itemIndexes = [];
	if(payload.modalType == "update" || payload.modalType == "view"){
		for(var i = 0; i < payload.currentItem.to.length; i++)
	  		itemIndexes.push(i);
	}else
		itemIndexes.push(0);
	return { ...state, ...payload, modalVisible: true, itemIndexes}
}

export default obj

