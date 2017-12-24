/* global window */
// import { crudModelGenerator } from './common'
import delivery from '../delivery'
import pathToRegexp from 'path-to-regexp'

const resourceName = "delivery"
const collectionName = "deliveries"

var obj = Object.assign({},delivery);
// function addBlanckTo(state){}
obj.namespace = "deliveryDetail";
obj.subscriptions = {
  setup ({ dispatch, history }) {
    history.listen(({ pathname }) => {
      const match = pathToRegexp('/delivery/:id').exec(pathname)
      if (match) {
        dispatch({ type: 'editItem', payload: { id: match[1] } })
      }
    })
  }
}

export default obj

