import { request, config } from 'utils'
const { APIV1, api } = config

export async function querySituation (params) {
  return request({
    url: `${APIV1}/vehicles/situation`,
    method: 'get',
    data: params,
  })
}

export async function assignTo (params) {
  return request({
    url: assginTo,
    method: 'post',
    data: params,
  })
}

export async function locationList (params) {
  return request({
    url: api.locationList,
    method: 'post',
    data: params,
  })
}
