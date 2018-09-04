const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')
const city = require('../utils/city')
const tools = require('../utils/cityTools')
const cookietools = require('../utils/cookietools')
const {PayState, PayType, OrderDetailState, PayChannel} = require('../utils/enums')
const { apiPrefix } = config
//DTO举例
/*et orderPostDTO = Mock.mock({
  'data|15-20': [
    {
      from: {name: '@cname', phone: /^1[34578]\d{9}$/, district: '@county(true)', address: {str:'@cword(5, 10)', x:'33', y:'116'}},
      orders:[
        {
          to: {name: '@cname', phone: /^1[34578]\d{9}$/, district: '@county(true)', address: {str:'@cword(5, 10)', x:'33', y:'116'}}, 
          payment: {
            'deliverPrice|150-250.1-2': 1, 
            'insurancePrice|150-250.1-2': 1, 
          },
          cargoes: [{name: '@cname', remark: '@cname', 'weight|10-100.1-2': 1, 'volume|10-100.1-2': 1, 'price|10-100.1-2': 1, 'cargoType|+1':["冷链", "百货", "建材"]}], 
          distance: 100,
        }
      ],
      payment: {
        'deliverPrice|150-250.1-2': 1, 
        'insurancePrice|150-250.1-2': 1, 
        'payPrice|300-500.1-2': 1, 
      },
      'customerId|+1': [0,1,2,3,4,5],
    }
  ],
})*/

let orderModals = Mock.mock({
  'data|3-5': [
    {
      'id|+1': 10000001,
      // id: '@id',
      'state|+1': ["NOT_PAID", "COMPLETED", /*.INVALID*/],
      from: {name: '@cname', phone: /^1[34578]\d{9}$/, district: 110101, 'address|+1': [{str:'东直门', x:'33', y:'116'}, {str:'三里屯', x:'33.01', y:'116'}]},
      to:   {name: '@cname', phone: /^1[34578]\d{9}$/, district: 110101, address: {str:'天安门', x:'33', y:'116.01'}}, 
      cargoes: [{name: '@cname', remark: '@cname', 'weight|10-100.1-2': 1, 'volume|10-100.1-2': 1, 'price|10-100.1-2': 1, 'cargoType|+1':["冷链", "百货", "建材"]}], 
      payment: {
        'id|+1': [1,2,3/*, PayType.RECEIVER_PAY, PayType.SENDER_ORDER_PAY*/],
        'no|+1': ["P54792716091396","P54792716091397","P54792716091398"/*, PayType.RECEIVER_PAY, PayType.SENDER_ORDER_PAY*/],
        'deliverPrice|150-250.1-2': 1, 
        'insurancePrice|150-250.1-2': 1, 
        'payPrice|300-500.1-2': 1, 
        'originalPrice|150-250.1-2': 1, 
        'payType|+1': ["SENDER_PAY"/*, PayType.RECEIVER_PAY, PayType.SENDER_ORDER_PAY*/],
        'payState|+1': ["NOT_PAID", "COMPLETE", ],
        'items': [{id: '@id', payState: "COMPLETE", payChannel: "ALIPAY", tradeNo:'@id', finishTime:'@datetime'}]
      },
      distance: 100,
      'deliverOrders|+1':[/*[{}],*/[{'id|+1':10000001, 'deliverOrderState|+1':"NOT_RECEIVED", distance: 100,'customerOrder.id|+1':10000001,from:{name:'@cname',phone:/^1[34578]\d{9}$/,district:'@county(true)',address:'@ctitle'},to:{name:'@cname',phone:/^1[34578]\d{9}$/,district:'@county(true)',address:'@ctitle'},'price|150-250.1-2':1,vehicle:{id:"@id",number:'贵'+'@character("upper")'+'@string("number", 5)'},driver:{id:"@id",name:'@cname',phone:/^1[34578]\d{9}$/},detail:'@ctitle','cube|1-100.1-2':1,'status|0-3':1,createTime:'@datetime',distributTime:'@datetime',loadTime:'@datetime',completeTime:'@datetime'}]],
      createTime: '@datetime',
      //该字段仅用于mock中筛选元素
      'customerId|+1': [0,1,2,3,4,5],
      //该字段仅用于mock中筛选元素
      'driverId|+1': [0,1,2,3,4,5],
    }
  ],
})

      //列表DTO
// let orderListDTO = Mock.mock({
//   'data|3-5': [
//     {
//       'id|+1': 10000001,
//       'state|+1': [/*OrderDetailState.NOT_DISTRIBUTED, OrderDetailState.*/"ONBOARD", "COMPLETED", /*.INVALID*/],
//       from: {name: '@cname', phone: /^1[34578]\d{9}$/, district: 140425, address: {str:'@cword(5, 10)', x:'33', y:'116'}},
//       to:   {name: '@cname', phone: /^1[34578]\d{9}$/, district: 140425, address: {str:'@cword(5, 10)', x:'33', y:'116'}}, 
//       payment: {
//         'payPrice|300-500.1-2': 1, 
//       },
//       createTime: '@datetime',
//       'customerId|+1': [0,1,2,3,4,5],
//     }
//   ],
// })


// let vodb = orderListDTO.data
let database = orderModals.data

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] == key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {
  [`GET ${apiPrefix}/orders/t`] (req, res) {
    res.status(200).json({
      data: 111
    })
  },
  [`GET ${apiPrefix}/orders/payment`] (req, res) {
    const { query } = req
    let { paymentId } = query
    res.status(200).json({"code":"200","msg":"接口调用成功","sub_code":"20000","sub_msg":"操作成功","data":{"creator":"","createTime":"2018-08-31","lastModifyTime":"2018-08-31","lastModifier":"","id":4,"no":"P55156662140930","payState":"UNPAY","finishTime":"","expireTime":"2018-08-31","originalPrice":7333.00,"payPrice":7333.00,"deliverPrice":"","insurancePrice":"","payType":"SENDER_PAY","customer":{"id":""},"payments":[],"orderDetails":[{"id":"C55156660043777","cargoes":[{"name":"","count":"","weight":4.00,"volume":5.00,"price":"","cargoType":"","remark":"1231231"}],"state":"NOT_PAID","payPrice":7333.00,"from":{"name":"123123","phone":"123123","district":110102,"address":{"str":"北京市东城区天安门广场","x":39.910154,"y":116.40408}},"to":{"name":"123123","phone":"23123131","district":210521,"address":{"str":"烟台市芝罘区大悦城","x":37.552025,"y":121.393433}},"createTime":"2018-08-31","customerId":"","distance":""}],"deleted":false}})
  },


  [`GET ${apiPrefix}/orders`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1
    var user = cookietools.getUser(req);
    if(user.role == "CUSTOMER"){
      other['customerId'] = user.id
    }
    if(user.role == "DRIVER"){
      other['driverId'] = user.id
    }
    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          // if ({}.hasOwnProperty.call(item, key)) {
            var itemValue = '';
            if (user.role == "DRIVER"){
              if(item.state == OrderDetailState.NOT_DISTRIBUTED)
                return 1;
            }
            if (key.indexOf('.')>-1) {
              itemValue = String(item[key.split('.')[0]][key.split('.')[1]]).trim();
            }  
            else if (key === 'createTime') {
              const start = new Date(other[key][0]).getTime()
              const end = new Date(other[key][1]).getTime()
              const now = new Date(item[key]).getTime()
              if (start && end) {
                return now >= start && now <= end
              }
              return true
            }else{
              itemValue = item[key];
            }
            return String(itemValue).trim().indexOf(decodeURI(other[key]).trim()) > -1
        })
      }
    }

    res.status(200).json({
      data: {
        content : newData.slice((page - 1) * pageSize, page * pageSize),
        total: newData.length
      }
    })
  },

  [`DELETE ${apiPrefix}/orders`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/orders`] (req, res) {
    const newData = req.body
   
    var user = cookietools.getUser(req);
    newData.from.district = newData.from.district
    for(var i in newData.orders){
      var customerOrder = {};
      customerOrder.id = Mock.mock('@id');
      customerOrder.state = "NOT_PAID";
      customerOrder.from = newData.from
      customerOrder.to = newData.orders[i].to
      customerOrder.to.district = customerOrder.to.district
      customerOrder.cargoes = newData.orders[i].cargoes
      customerOrder.payment = newData.payment
      customerOrder.distance = newData.orders[i].distance
      customerOrder.createTime = Mock.mock('@datetime')
      customerOrder.customerId = user.id
      customerOrder.deliverOrders = []
      database.unshift(customerOrder)

    }

    // database.unshift(newData)
    // 测试创建成功返回paymentId
    res.status(200).json({data:1})
  },

  [`GET ${apiPrefix}/orders/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json({data:data})
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/orders/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`POST ${apiPrefix}/orders/paid`] (req, res) {
    const { id } = req.params
    let isExist = false;
    database = database.map((item) => {
      //测试支付完成
      if (item.id === 10000001||item.id === 10000003) {
        isExist = true
        item.state = "NOT_DISTRIBUTED"
        //测试代码 司机id=2
        // item.deliverOrders[0].deliverOrderState = "NOT_DISTRIBUTED";
        // if(item.)
      }
      return item
    })
      res.status(200).end()
    /*
    if (isExist) {
      res.status(200).end()
    } else {
      res.status(404).json(NOTFOUND)
    }*/
  },

  [`POST ${apiPrefix}/orders/cancel`] (req, res) {
    const { id } = req.params
    let isExist = false;
    database = database.map((item) => {
      if (item.id === id) {
        isExist = true
        item.state = "INVALID"
        //测试代码 司机id=2
        item.deliverOrders[0].deliverOrderState = "INVALID";
        item.driverId = 2
        // if(item.)
      }
      return item
    })

    // if (isExist) {
      res.status(200).end()
    // } else {
    //   res.status(404).json(NOTFOUND)
    // }
  },

  [`POST ${apiPrefix}/orders/stateTransfer`] (req, res) {
    const { id, state } = req.params
    let isExist = false;
    database = database.map((item) => {
      if (item.id === id) {
        isExist = true
        item.state = state
        //测试代码 司机id=2
        if(state == "NOT_PAID")
          item.deliverOrders = Mock.mock([{'id|+1':10000001, deliverOrderState:state, distance: 100,from:item.from,to:item.to,'price|150-250.1-2':1,vehicle:{id:"@id",number:'贵A12345'},driver:{id:2,name:'测试司机',phone:/^1[34578]\d{9}$/},detail:'@ctitle','cube|1-100.1-2':1,'status|0-3':1,createTime:'@datetime',distributTime:'@datetime',loadTime:'@datetime',completeTime:'@datetime'}]);
        item.deliverOrders[0].deliverOrderState = state;
        item.driverId = 2
        // if(item.)
      }
      return item
    })

    if (isExist) {
      res.status(200).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },
}
