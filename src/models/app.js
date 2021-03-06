/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import qs, { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { query, logout } from 'services/app'
import * as menusService from 'services/menus'
import queryString from 'query-string'
import jwt from 'jsonwebtoken';

const { prefix } = config
const menuList =[
  {
    id: 1,
    icon: 'laptop',
    name: 'Dashboard',
    route: '/dashboard',
  },{
    id: 2,
    // bpid: '1',
    name: '订单管理',
    icon: 'book',
    route: '/order',
  },{
    id: 3,
    // bpid: '0',
    name: '运单管理',
    icon: 'solution',
  },{
    id: 31,
    bpid: 3,
    mpid: 3,
    name: '运单列表',
    icon: 'bars',
    route: '/delivery',
  },{
    id: 33,
    bpid: 3,
    mpid: 3,
    name: '运单详情',
    icon: 'setting',
    route: '/delivery/:id',
  },{
    id: 4,
    // bpid: '1',
    name: '车辆管理',
    icon: 'car',
  },{
    id: 41,
    bpid: 4,
    mpid: 4,
    name: '车辆列表',
    icon: 'video-camera',
    route: '/vehicle',
  },/*{
    id: 42,
    bpid: 4,
    mpid: 4,
    name: '车辆分布',
    icon: 'dot-chart',
    route: '/vehicle/map',
  },*/{
    id: 43,
    bpid: 4,
    mpid: 4,
    name: '轨迹回放',
    icon: 'retweet',
    route: '/vehicle/:id/track',
  },{
    id: 5,
    // bpid: '1',
    name: '司机管理',
    icon: 'user',
    route: '/driver',
  },
];
export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  
  effects: {

    * query ({
      payload,
    }, { call, put, select }) {
      // const { success, user } = yield call(query, payload)
      const { locationPathname } = yield select(_ => _.app)
      const cookie = document.cookie
      var cookies = {};
      if(cookie)
        cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
      const response = {}
      var user = {}
      var permissions;
      var success;
      var decoded;
      if (cookies.token) {
        permissions = jwt.decode(cookies.token)
        success = permissions.exp > Date.parse(new Date())/1000;
      }
      if(permissions && success){
        let menu = menuList
        if (permissions.role === "ADMIN" || permissions.role === "DEVELOPER") {
          // permissions.visit = menu.map(item => item.id)
        } else {
          menu = menuList.filter((item) => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }
        permissions.visit = menu.map(item => item.id)

        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
            menu,
          },
        })
        if (location.pathname === '/login') {
          yield put(routerRedux.push({
            pathname: '/dashboard',
          }))
        }
      }else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
      }
    },

    * logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
