const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

module.exports = {
  name: 'TMS-城配',
  prefix: 'antdAdmin',
  footerText: '北京光点互动  © 2017',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  openPages: ['/login', '/register', '/authentication'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  api: {
    userLogin: `${APIV1}/user/login`,
    userLogout: `${APIV1}/user/logout`,
    userInfo: `${APIV1}/userInfo`,
    users: `${APIV1}/users`,
    orders: `${APIV1}/users`,
    posts: `${APIV1}/posts`,
    user: `${APIV1}/user/:id`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV1}/menus`,
    weather: `${APIV1}/weather`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV2}/test`,
    'vehicles_candidate': `${APIV1}/vehicles/candidate`,
    'assginTo': `${APIV1}/deliveries/assignTo`,
    'split': `${APIV1}/deliveries/split`,
    'locationList': `${APIV1}/vehicles/locationList`,
    'order_state_transfer':`${APIV1}/orders/stateTransfer`
  },
}
