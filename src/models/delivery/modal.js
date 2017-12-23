// import modelExtend from 'dva-model-extend'
// import { query } from 'services/posts'
// import { pageModel } from 'models/common'
// import queryString from 'query-string'

// import { crudModelGenerator } from './common'
// var post = crudModelGenerator("post")
const deliveryModal = {
  namespace: "deliveryModal",
  state: {
    vehicles: []
  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    querySuccess (state, { payload }) {
      const { list, pagination } = payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
  },
  effects: {
    * query ({
      payload,
    }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            vehicles: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      } else {
        throw data
      }
    },
  }
}

export default deliveryModal
