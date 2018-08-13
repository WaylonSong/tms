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
      "track|3-5":[{"x|+1":[114.99, 115.01, 115.12, 115.22, 115.32, 115.55, 115.65, 115.88, 115.998, 116.012, 116.1234, 116.234, 116.252, 116.272, 116.292, 116.252, 116.292, 116.312, 116.352,],"y|+1":[39.5, 39.7, 39.84, 39.89, 39.9856, 39.9955,]}],
      "location|1":[{ x: 116.1234, y: 39.89},{ x: 116.234, y: 39.8955},{ x: 116.34, y: 39.9955},{ x: 116.34, y: 40.1},{ x: 116.234, y: 39.7955},{ x: 116.4, y: 39.9955},{ x: 116.2222, y: 39.8986},{ x: 116.2522, y: 39.8996},{ x: 116.4232, y: 39.916},{ x: 116.2232, y: 39.9856},{ x: 116.3252, y: 40.056}],      
    },
  ],
})


let database = ordersListData2.data
let withtrackdb = assignedVehicleList.data


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
          // if ({}.hasOwnProperty.call(item, key)) {
            var itemValue = '';
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

  [`GET ${apiPrefix}/${collectionName}/candidate`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = assignedVehicleList.data
    res.status(200).json({
      data: {
        content : newData.slice((page - 1) * pageSize, page * pageSize),
        total: newData.length
      }
    })
  },

  [`GET ${apiPrefix}/${collectionName}/situation`] (req, res) {
    const { query } = req
    let { number } = query
    let newData = withtrackdb
    let result = {}
    var vehicles = newData.filter((item) => {
      return item.number == number
    })
    if(vehicles.length == 0){
      result = newData[parseInt(Math.random()*100000%newData.length)]
    }else {
      result = vehicles[0]
    }
    console.log(result)
    res.status(200).json({
      data: {
        content : result,
        total: result.length
      }
    })
  },

  [`GET ${apiPrefix}/${collectionName}/locationList`] (req, res) {
    const xyList = [{ x: 116.1234, y: 39.89},{ x: 116.234, y: 39.8955},{ x: 116.34, y: 39.9955},{ x: 116.34, y: 40.1},{ x: 116.234, y: 39.7955},{ x: 116.4, y: 39.9955},{ x: 116.2222, y: 39.8986},{ x: 116.2522, y: 39.8996},{ x: 116.4232, y: 39.916},{ x: 116.2232, y: 39.9856},{ x: 116.3252, y: 40.056}];
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = withtrackdb.slice((page - 1) * pageSize, page * pageSize);
    var locationList = [];
    for(var i in newData){
      var randomIndex = parseInt(Math.random()*100%xyList.length)
      locationList.push({...newData[i], x:xyList[randomIndex].x, y:xyList[randomIndex].y});
    }
    res.status(200).json({
      data: {
        content : locationList,
        total: withtrackdb.length
      }
    })

  },

  [`DELETE ${apiPrefix}/${collectionName}`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/${collectionName}`] (req, res) {
    var newData = req.body
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

  // [{ x: 116.1234, y: 39.89},{ x: 116.234, y: 39.8955},{ x: 116.34, y: 39.9955},{ x: 116.34, y: 40.1},{ x: 116.234, y: 39.7955},{ x: 116.4, y: 39.9955},{ x: 116.2222, y: 39.8986},{ x: 116.2522, y: 39.8996},{ x: 116.4232, y: 39.916},{ x: 116.2232, y: 39.9856},{ x: 116.3252, y: 40.056}]
}
