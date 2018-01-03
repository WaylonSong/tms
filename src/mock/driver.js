const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')
const collectionName = "drivers"
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
      name: '@cname',
      phone: /^1[34578]\d{9}$/,
      number: '贵'+'@character("upper")'+'@string("number", 5)',
      'status|0-1': 1,
      'occupy|1-20': 1, 
      'gender|+1': ["男", "女"],
      'education|+1': ['小学', '中学', '专科', '本科', '研究生及以上'],
      'brand|+1': ["五菱", "依维柯", "金杯", "卡玛斯", "东风"],
      idCard: '@id',
      bankCard: '@id',
      drivers: '@cname'+' / '+'@cname'+' / '+'@cname', 
      createTime: '@datetime',
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
