/* global window */
import { crudModelGenerator } from './common'
var order = crudModelGenerator("order")
// function addBlanckTo(state){}
order.state["item"] = {from:{},to:[{}]};
order.reducers['addBlanckTo'] = (state)=>  {
	var itemIndexes = [];
	Object.assign(itemIndexes, state.itemIndexes);
	itemIndexes.push(itemIndexes[itemIndexes.length-1]+1);
	return { ...state, itemIndexes}
}
order.reducers['minusTo'] = (state, {payload})=>  {
	var itemIndexes = [];
	Object.assign(itemIndexes, state.itemIndexes);
	itemIndexes.splice(payload, 1);
	return { ...state, itemIndexes}
}

order.reducers['showModal'] = (state, { payload }) => {
	var itemIndexes = [];
	if(payload.modalType == "update"){
		for(var i = 0; i < payload.currentItem.to.length; i++)
	  		itemIndexes.push(i);
	}else
		itemIndexes.push(0);
	return { ...state, ...payload, modalVisible: true , itemIndexes}
}
export default order

