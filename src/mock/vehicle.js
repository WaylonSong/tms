const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')
const collectionName = "vehicles"
const { apiPrefix } = config

// let ordersListData = Mock.mock({
//   'data|80-100': [
//     {
//       id: '@id',
//       name: '@name',
//       from: {name: '@name', phone: /^1[34578]\d{9}$/, address: '@county(true)'},
//       to: [{name: '@name', phone: /^1[34578]\d{9}$/, address: '@county(true)'}, {name: '@name', phone: /^1[34578]\d{9}$/, address: '@county(true)'}],
//       'status|1-2': 1,
//       createTime: '@datetime',
//       avatar () {
//         return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
//       },
//     },
//   ],
// })

let ordersListData2 = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      number: '贵'+'@character("upper")'+'@string("number", 5)',
      'status|0-1': 1,
      'occupy|1-20': 1, 
      'type|+1': ["箱货", "货车", "平板", "面包车", "冷藏车"],
      'brand|+1': ["五菱", "依维柯", "金杯", "卡玛斯", "东风"],
      drivers: [{id:'@id', name: '@cname', phone: /^1[34578]\d{9}$/}, {id:'@id', name: '@cname', phone: /^1[34578]\d{9}$/}, {id:'@id', name: '@cname', phone: /^1[34578]\d{9}$/}], 
      company: '@ctitle(3,5)', 
      owner: '@cname',
      phone: /^1[34578]\d{9}$/, 
      createTime: '@datetime',
    },
  ],
})

let assignedVehicleList = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      number: '贵'+'@character("upper")'+'@string("number", 5)',
      'status|1-2': 1,
      'occupy|1-20': 1, 
      'type|+1': ["箱货", "货车", "平板", "面包车", "冷藏车"],
      'brand|+1': ["五菱", "依维柯", "金杯", "卡玛斯", "东风"],
      driver: {name:'@cname', phone: /^1[34578]\d{9}$/, },
      company: '@ctitle(3,5)', 
      track: [{'x|116.1-4':1, 'y|39.89-92':1 },{'x|116.1-4':1, 'y|39.89-92':1 },{'x|116.1-4':1, 'y|39.89-92':1 },{'x|116.1-4':1, 'y|39.89-92':1 },{'x|116.1-4':1, 'y|39.89-92':1 },{'x|116.1-4':1, 'y|39.89-92':1 },{'x|116.1-4':1, 'y|39.89-92':1 },{'x|116.1-4':1, 'y|39.89-92':1 },],
      location: {'x|116.1-4':1, 'y|39.89-92':1 }
    },
  ],
})


let database = ordersListData2.data


const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
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

  [`GET ${apiPrefix}/${collectionName}`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            if (key === 'address') {
              return other[key].every(iitem => item[key].indexOf(iitem) > -1)
            } else if (key === 'createTime') {
              const start = new Date(other[key][0]).getTime()
              const end = new Date(other[key][1]).getTime()
              const now = new Date(item[key]).getTime()

              if (start && end) {
                return now >= start && now <= end
              }
              return true
            }
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`GET ${apiPrefix}/${collectionName}/candidate`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = assignedVehicleList.data
    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`GET ${apiPrefix}/${collectionName}/situation`] (req, res) {
    const { query } = req
    let { number } = query
    let newData = database
    var vehicles = newData.filter((item) => {
      return item.number == number
    })
    res.status(200).json({
      data: vehicles
    })
  },

  [`DELETE ${apiPrefix}/${collectionName}`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/${collectionName}`] (req, res) {
    var newData = req.body
    console.log(newData);
    var drivers = newData.drivers;
    for(var i in drivers){
      if(drivers[i].hasOwnProperty('id')){
        if(!drivers[i].hasOwnProperty('name'))
          drivers[i]['name'] = Mock.mock('@cname');
        if(!i.hasOwnProperty('phone'))
          drivers[i]['phone'] = Mock.mock(/^1[34578]\d{9}$/);
      }
    }

    newData.createTime = Mock.mock('@now')
    database.unshift(newData)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/${collectionName}/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/${collectionName}/:id`] (req, res) {
    console.log("req.params", req.params);
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PUT ${apiPrefix}/${collectionName}/:id`] (req, res) {
    const { id } = req.params
    const editItem = req.body
    let isExist = false

    database = database.map((item) => {
      if (item.id === id) {
        isExist = true
        var drivers = editItem.drivers;
        for(var i in drivers){
          if(drivers[i].hasOwnProperty('id')){
            if(!drivers[i].hasOwnProperty('name'))
              drivers[i]['name'] = Mock.mock('@cname');
            if(!i.hasOwnProperty('phone'))
              drivers[i]['phone'] = Mock.mock(/^1[34578]\d{9}$/);
          }
        }
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  
}
