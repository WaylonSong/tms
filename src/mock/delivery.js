const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')
const { EnumDeliveryStatus }= require('../utils/enums')
const { apiPrefix } = config
const collectionName = "deliveries"

let deliveryListData2 = Mock.mock({
  'data|20': [
    {
      'id|+1': 10000001,
      'customerOrder.id|+1': 10000001,
      from: {name: '@cname', phone: /^1[34578]\d{9}$/, district: 110101, 'address|+1': [{str:'东直门', x:'33', y:'116'}, {str:'三里屯', x:'33.01', y:'116'}]},
      to:   {name: '@cname', phone: /^1[34578]\d{9}$/, district: 110101, address: {str:'天安门', x:'33', y:'116.01'}}, 
      'deliverPrice|150-250.1-2': 1,
      vehicle: {id:"@id", plateNumber:'贵'+'@character("upper")'+'@string("number", 5)'},
      driver:{id:"@id", name: '@cname', phone: /^1[34578]\d{9}$/},
      distance: 100,
      detail:'@ctitle',
      'deliverOrderState|+1': ["NOT_PAID", "NOT_DISTRIBUTED", "NOT_RECEIVED"],
      createTime: '@datetime',
      distributTime: '@datetime',
      "cargoes": [{
        "name": "",
        "count": "",
        "weight": 2.00,
        "volume": 5.00,
        "price": "",
        "cargoType": "",
        "remark": "123132131"
      }],
      loadTime: '@datetime',
      completeTime: '@datetime',
    },
  ],
})


let database = deliveryListData2.data


const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data
  if(key == ":id")
    return {};

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

  [`DELETE ${apiPrefix}/${collectionName}`] (req, res) {
    const { ids } = req.params
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/${collectionName}`] (req, res) {
    const newData = req.params
    newData.createTime = Mock.mock('@now')
    newData.avatar = newData.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.nickName.substr(0, 1))
    newData.id = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

  [`POST ${apiPrefix}/${collectionName}/assignTo`] (req, res) {
    const newData = req.params
    const {deliverOrderNo, vehicleId, driverId} = req.params
    database = database.map((item) => {
      if (item.id === deliverOrderNo) {
        var editItem = Object.assign({}, item)
        editItem.vehicle.id = vehicleId
        editItem.deliverOrderState = "NOT_RECEIVED"
        return editItem
      }
      return item
    })
    res.status(200).end()
  },

  [`POST ${apiPrefix}/${collectionName}/split`] (req, res) {
    const {id, splitCubes} = req.params
    var subItems = [];
    for(var j in database){
      if (database[j].id === id) {
        database[j].status = "SPLITTED"
        database[j].splitTime = Mock.mock('@now')

        var subTotalPrice = 0;
        database[j].subs = [];
        for(var i in splitCubes){
          var subItem = Object.assign({}, database[j])
          subItem.id = Mock.mock('@id')
          subItem.cube = splitCubes[i]
          if(i == splitCubes.length-1)
            subItem.price = new Number(database[j].price-subTotalPrice).toFixed(2);
          else{
            subItem.price = new Number(subItem.cube*database[j].price/database[j].cube).toFixed(2);
            subTotalPrice += new Number(subItem.price).toFixed(2);
          }
          subItem.status = EnumDeliveryStatus.NOT_DISTRIBUTED
          subItems.push(subItem)
          database[j].subs.push(subItem.id)
        }
        break;
      }
    }
    database.unshift(...subItems)
    res.status(200).end()
  },

  [`GET ${apiPrefix}/${collectionName}/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json({data:data})
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
