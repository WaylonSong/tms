import { request, config } from 'utils'
const { apiPrefix } = config

export async function query (params, url) {
  return request({
    url: `${apiPrefix}/${url}/:id`,
    method: 'get',
    data: params,
  })
}

export async function queryAll (params, url) {
  return request({
    url: `${apiPrefix}/${url}s`,
    method: 'get',
    data: params,
  })
}

export async function removeAll (params, url) {
  return request({
    url: `${apiPrefix}/${url}s`,
    method: 'delete',
    data: params,
  })
}

export async function create (params, url) {

  return request({
    url: `${apiPrefix}/${url}`,
    method: 'post',
    data: params,
  })
}

export async function remove (params, url) {
  console.log("params", params);
  return request({
    url:`${apiPrefix}/${url}/:id`,
    method: 'delete',
    data: params,
  })
}

export async function update (params, url) {
  return request({
    url:`${apiPrefix}/${url}/:id`,
    method: 'patch',
    data: params,
  })
}
