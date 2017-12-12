import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import queryString from 'query-string'
import { queryAll, query, deleteAll, create, remove, update } from 'services/crud'
const { prefix } = config
const model = {
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

const pageModel = modelExtend(model, {

  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Items`,
      current: 1,
      total: 0,
    },
  },

  reducers: {
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

})

const crudModelGenerator = (namespace)=>{return{
    namespace,
    state: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `Total ${total} Items`,
        current: 1,
        total: 0,
      },
      currentItem: {},
      modalVisible: false,
      modalType: 'create',
      selectedRowKeys: [],
      isMotion: window.localStorage.getItem(`${prefix}${namespace}IsMotion`) === 'true',
    },

    subscriptions: {
      setup ({ dispatch, history }) {
        history.listen((location) => {
          if (location.pathname === `/${namespace}`) {
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
    },
    reducers: {
      updateState (state, { payload }) {
        return {
          ...state,
          ...payload,
        }
      },

      showModal (state, { payload }) {
        return { ...state, ...payload, modalVisible: true }
      },

      hideModal (state) {
        return { ...state, modalVisible: false }
      },

      switchIsMotion (state) {
        window.localStorage.setItem(`${prefix}${namespace}IsMotion`, !state.isMotion)
        return { ...state, isMotion: !state.isMotion }
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
    effects:{
      * query ({ payload}, { call, put }) {
        if(payload){
          ;
        }else{
          payload = location.query || queryString.parse(location.search)|| { page: 1, pageSize: 10 }
        }
        const data = yield call(queryAll, payload, namespace)
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.data,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.total,
              },
            },
          })
        }
      },
      * delete ({ payload }, { call, put, select }) {
        const data = yield call(remove, { id: payload }, namespace)
        const { selectedRowKeys } = yield select(o => o[namespace])
        if (data.success) {
          yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
          yield put({ type: 'query' })

        } else {
          throw data
        }
      },

      * multiDelete ({ payload }, { call, put }) {
        const data = yield call(removeAll, payload, namespace)
        if (data.success) {
          yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
          yield put({ type: 'query' })
        } else {
          throw data
        }
      },

      * create ({ payload }, { call, put }) {
        const data = yield call(create, payload, namespace)
        if (data.success) {
          yield put({ type: 'hideModal' })
          yield put({ type: 'query' })
        } else {
          throw data
        }
      },

      * update ({ payload }, { select, call, put }) {
        const id = yield select(({ user }) => user.currentItem.id)
        const newObj = { ...payload, id }
        const data = yield call(update, newObj, namespace)
        if (data.success) {
          yield put({ type: 'hideModal' })
          yield put({ type: 'query' })
        } else {
          throw data
        }
      }
    }
}}

module.exports = {
  model,
  pageModel,
  crudModelGenerator
}
