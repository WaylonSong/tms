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
      driveLicense: '@id',
      plateNumber: '贵'+'@character("upper")'+'@string("number", 5)',
      'state|+1': ["ON", "OFF"],
      'loads|1-20': 1, 
      'vehicleType|+1': ["箱货", "货车", "平板", "面包车", "冷藏车"],
      'brand|+1': ["五菱", "依维柯", "金杯", "卡玛斯", "东风"],
      drivers: [{id:'@id', name: '@cname', phone: /^1[34578]\d{9}$/}, {id:'@id', name: '@cname', phone: /^1[34578]\d{9}$/}, {id:'@id', name: '@cname', phone: /^1[34578]\d{9}$/}], 
      company: '@ctitle(3,5)', 
      owner: '@cname',
      ownerPhone: /^1[34578]\d{9}$/, 
      createTime: '@datetime',
    },
  ],
})

let assignedVehicleList = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      driveLicense: '@id',
      plateNumber: '贵'+'@character("upper")'+'@string("number", 5)',
      'state|+1': ["ON", "OFF"],
      'loads|1-20': 1, 
      'remainLoads|1-20': 1, 
      'vehicleType|+1': ["箱货", "货车", "平板", "面包车", "冷藏车"],
      'brand|+1': ["五菱", "依维柯", "金杯", "卡玛斯", "东风"],
      driver: {id:'@id',name:'@cname', phone: /^1[34578]\d{9}$/, },
      company: '@ctitle(3,5)', 
      "track|3-5":[{"x|+1":[114.99, 115.01, 115.12, 115.22, 115.32, 115.55, 115.65, 115.88, 115.998, 116.012, 116.1234, 116.234, 116.252, 116.272, 116.292, 116.252, 116.292, 116.312, 116.352,],"y|+1":[39.5, 39.7, 39.84, 39.89, 39.9856, 39.9955,]}],
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

    // res.status(200).json({
    //   data: {
    //     content : newData.slice((page - 1) * pageSize, page * pageSize),
    //     total: newData.length
    //   }
    // })
    res.status(200).json({"code":"200","msg":"接口调用成功","sub_code":"20000","sub_msg":"操作成功","data":{"content":[{"id":2,"vehicleType":"货车","plateNumber":"222","driveLicense":"111111","operatorLicense":"","state":"OFF","brand":"11","company":"22","owner":"22","ownerPhone":"22","loads":222.0,"drivers":[{"creator":1,"createTime":"2018-08-28","lastModifyTime":"2018-08-28","lastModifier":"","version":1,"id":"111","name":"测试姓名","gender":"MALE","drivingLicense":"10010222443434","idCard":"2357111317","education":"本科","bankCard":"1234567","phone":"13912345678","sysDriver":"","deleted":false}]},{"id":1,"vehicleType":"货车","plateNumber":"222","driveLicense":"1","operatorLicense":"","state":"ON","brand":"111","company":"11","owner":"11","ownerPhone":"11","loads":111.0,"drivers":[]}],"last":true,"totalPages":1,"totalElements":2,"size":20,"number":0,"sort":[{"direction":"DESC","property":"id","ignoreCase":false,"nullHandling":"NATIVE","ascending":false,"descending":true}],"first":true,"numberOfElements":2}});
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
    // res.status(200).json({"code":"200","msg":"接口调用成功","sub_code":"20000","sub_msg":"操作成功","data":{"content":[{"id":2,"vehicleType":"货车","plateNumber":"222","driveLicense":"111111","operatorLicense":"","state":"OFF","brand":"11","company":"22","owner":"22","ownerPhone":"22","loads":222.0,"drivers":[{"creator":1,"createTime":"2018-08-28","lastModifyTime":"2018-08-28","lastModifier":"","version":1,"id":"111","name":"测试姓名","gender":"MALE","drivingLicense":"10010222443434","idCard":"2357111317","education":"本科","bankCard":"1234567","phone":"13912345678","sysDriver":"","deleted":false}]},{"id":1,"vehicleType":"货车","plateNumber":"222","driveLicense":"1","operatorLicense":"","state":"ON","brand":"111","company":"11","owner":"11","ownerPhone":"11","loads":111.0,"drivers":[]}],"last":true,"totalPages":1,"totalElements":2,"size":20,"number":0,"sort":[{"direction":"DESC","property":"id","ignoreCase":false,"nullHandling":"NATIVE","ascending":false,"descending":true}],"first":true,"numberOfElements":2}});
  },

  [`GET ${apiPrefix}/${collectionName}/situation`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = assignedVehicleList.data
    res.status(200).json({
      /*data: {
        content : newData.slice((page - 1) * pageSize, page * pageSize),
        total: newData.length
      }*/
      // 后台接口数据
      "data":{"id":1,"vehicleType":"箱货","plateNumber":"京A123456","driveLicense":"9876543210","operatorLicense":"","state":"ON","brand":"大众","company":"大众公司","owner":"李四","ownerPhone":"18612345678","loads":3,"remainLoads":0,"driver":{"id":"1597654343872662","name":"张三","gender":"男","drivingLicense":"1597654343872662","idCard":"11012222222223333","education":"本科","bankCard":"23132131231312331","phone":"12312312313213","status":""},"track":[{"x":116.307629,"y":40.058359},{"x":116.307629,"y":40.158359}]}
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
          drivers[i]['ownerPhone'] = Mock.mock(/^1[34578]\d{9}$/);
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
        var drivers = editItem.drivers;
        for(var i in drivers){
          if(drivers[i].hasOwnProperty('id')){
            if(!drivers[i].hasOwnProperty('name'))
              drivers[i]['name'] = Mock.mock('@cname');
            if(!i.hasOwnProperty('phone'))
              drivers[i]['ownerPhone'] = Mock.mock(/^1[34578]\d{9}$/);
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
