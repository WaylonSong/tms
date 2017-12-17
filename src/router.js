import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const routes = [
    {
      path: '/dashboard',
      models: () => [import('./models/dashboard')],
      component: () => import('./routes/dashboard/'),
    }, {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    }, {
      path: '/user',
      models: () => [import('./models/user')],
      component: () => import('./routes/user/'),
    }, {
      path: '/user/:id',
      models: () => [import('./models/user/detail')],
      component: () => import('./routes/user/detail/'),
    },  /*{
      path: '/request',
      component: () => import('./routes/request/'),
    }, {
      path: '/UIElement/iconfont',
      component: () => import('./routes/UIElement/iconfont/'),
    }, {
      path: '/UIElement/search',
      component: () => import('./routes/UIElement/search/'),
    }, {
      path: '/UIElement/dropOption',
      component: () => import('./routes/UIElement/dropOption/'),
    }, {
      path: '/UIElement/layer',
      component: () => import('./routes/UIElement/layer/'),
    }, {
      path: '/UIElement/dataTable',
      component: () => import('./routes/UIElement/dataTable/'),
    }, {
      path: '/UIElement/editor',
      component: () => import('./routes/UIElement/editor/'),
    }, {
      path: '/chart/ECharts',
      component: () => import('./routes/chart/ECharts/'),
    }, {
      path: '/chart/highCharts',
      component: () => import('./routes/chart/highCharts/'),
    }, {
      path: '/chart/Recharts',
      component: () => import('./routes/chart/Recharts/'),
    }, {
      path: '/post',
      models: () => [import('./models/post')],
      component: () => import('./routes/post/'),
    },*/
    {
      path: '/order',
      models: () => [import('./models/order')],
      component: () => import('./routes/order/'),
    },{
      path: '/delivery',
      models: () => [import('./models/delivery')],
      component: () => import('./routes/delivery/'),
    },{
      path: '/vehicle',
      models: () => [import('./models/vehicle')],
      component: () => import('./routes/vehicle/'),
    },{
      path: '/vehicle/map',
      component: () => import('./routes/vehicle/Map'),
    },{
      path: '/vehicle/:id/track',
      component: () => import('./routes/vehicle/Track'),
    },{
      path: '/driver',
      models: () => [import('./models/driver')],
      component: () => import('./routes/driver/'),
    },{
      path: '/map',
      // models: () => [import('./models/order')],
      component: () => import('./routes/map/'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
