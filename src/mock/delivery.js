const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')
const { EnumDeliveryStatus }= require('../utils/enums')
const { apiPrefix } = config
const collectionName = "deliveries"

let deliveryListData2 = Mock.mock({
  'data|20-40': [
    {
      id: '@id',
      from: {name: '@cname', phone: /^1[34578]\d{9}$/, district: '@county(true)', address: '@ctitle'},
      to: {name: '@cname', phone: /^1[34578]\d{9}$/, district: '@county(true)', detail:'@ctitle', address: '@ctitle', 'cube|1-100.1-10': 1, 'price|50-200.1-2': 1}, 
      // from_name: '@cname',
      // from_phone: /^1[34578]\d{9}$/, 
      // from_district: '@county(true)', 
      // from_address: '@ctitle',
      'price|150-250.1-2': 1,
      // to_name: '@cname',
      // to_phone: /^1[34578]\d{9}$/,
      // to_district: '@county(true)',
      // to_address: '@ctitle',
      vehicle: '贵'+'@character("upper")'+'@string("number", 5)',
      driver:{name: '@cname', phone: /^1[34578]\d{9}$/},
      detail:'@ctitle',
      'cube|1-100.1-10': 1, 
      'status|0-3': 1,
      createTime: '@datetime',
      distributTime: '@datetime',
      loadTime: '@datetime',
      arriveTime: '@datetime',
    },
  ],
})


let database = deliveryListData2.data


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
  // return 
  //便于测试，随机id搜索不到。默认返回首元素
  console.log(array[0])
  return array[0]

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
          /*if ({}.hasOwnProperty.call(item, key)) {
            
          }
          return true*/
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
            var itemValue = item[key];
            if(key.indexOf('_') > -1){
              itemValue = item[key.split('_')[0]][key.split('_')[1]]
            }
            // console.log(itemValue)
            return String(itemValue).trim().indexOf(decodeURI(other[key]).trim()) > -1
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`DELETE ${apiPrefix}/${collectionName}`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/${collectionName}`] (req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.avatar = newData.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.nickName.substr(0, 1))
    newData.id = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

  [`POST ${apiPrefix}/${collectionName}/assignTo`] (req, res) {
    const newData = req.body
    const {id, vehicle_number} = req.body
    database = database.map((item) => {
      if (item.id === id) {
        var editItem = Object.assign({}, item)
        editItem.vehicle = vehicle_number
        editItem.status = EnumDeliveryStatus.NOT_RECEIVED
        return editItem
      }
      return item
    })
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